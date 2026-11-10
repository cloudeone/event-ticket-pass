const { supabase } = require('../config/supabase');
const { success, error, paginated } = require('../utils/response');
const { generateOrderNumber } = require('../utils/format');

const RESERVATION_TIMEOUT_MINUTES = parseInt(process.env.RESERVATION_TIMEOUT_MINUTES || '10', 10);

/**
 * Buat pesanan baru dan kunci kuota (FR-ORD-001)
 */
const createOrder = async (req, res) => {
  try {
    const { event_id, ticket_zone_id, quantity, idempotency_key } = req.body;
    const buyer_id = req.user.id;

    // BR-ORD-002: Quantity 1-12
    if (!quantity || quantity < 1 || quantity > 12) {
      return error(res, 'Jumlah tiket per pesanan harus antara 1 sampai 12 (BR-ORD-002).', 400);
    }

    if (!idempotency_key) {
      return error(res, 'Kunci idempotensi (idempotency_key) wajib disertakan.', 400);
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      // 1. Check idempotency in database
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('*, event:events(*), zone:ticket_zones(*)')
        .eq('idempotency_key', idempotency_key)
        .single();

      if (existingOrder) {
        return success(
          res,
          existingOrder,
          'Pesanan sudah dibuat sebelumnya (Respons Idempoten).'
        );
      }

      // 2. Atomically check and lock quota using stored procedure
      const { error: rpcError } = await supabase.rpc('check_quota_availability', {
        p_zone_id: ticket_zone_id,
        p_quantity: quantity,
      });

      if (rpcError) {
        return error(res, 'Sisa kuota tiket tidak mencukupi untuk jumlah yang diminta.', 400, rpcError.message);
      }

      // 3. Get zone price snapshot
      const { data: zoneData } = await supabase
        .from('ticket_zones')
        .select('price')
        .eq('id', ticket_zone_id)
        .single();

      const unit_price = zoneData.price;
      const total_price = unit_price * quantity;
      const order_number = generateOrderNumber();
      const expires_at = new Date(Date.now() + RESERVATION_TIMEOUT_MINUTES * 60 * 1000).toISOString();

      // 4. Insert order with waiting_payment status
      const { data: newOrder, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            order_number,
            buyer_id,
            event_id,
            ticket_zone_id,
            quantity,
            unit_price,
            total_price,
            status: 'waiting_payment',
            expires_at,
            idempotency_key,
          },
        ])
        .select('*, event:events(*), zone:ticket_zones(*)')
        .single();

      if (insertError) return error(res, insertError.message, 500);

      return success(
        res,
        newOrder,
        `Pesanan berhasil dibuat. Kuota terkunci selama ${RESERVATION_TIMEOUT_MINUTES} menit.`,
        201
      );
    }

    // Demo Mode Fallback
    const order_number = generateOrderNumber();
    const expires_at = new Date(Date.now() + RESERVATION_TIMEOUT_MINUTES * 60 * 1000).toISOString();
    const mockOrder = {
      id: `ord-${Date.now()}`,
      order_number,
      buyer_id,
      event_id,
      ticket_zone_id,
      quantity,
      unit_price: 350000,
      total_price: 350000 * quantity,
      status: 'waiting_payment',
      expires_at,
      idempotency_key,
      created_at: new Date().toISOString(),
    };

    return success(
      res,
      mockOrder,
      `Pesanan berhasil dibuat (Demo Mode). Kuota terkunci selama ${RESERVATION_TIMEOUT_MINUTES} menit.`,
      201
    );
  } catch (err) {
    return error(res, 'Gagal membuat pesanan.', 500, err.message);
  }
};

/**
 * List orders (FR-ORD-004 / FR-RPT-001)
 * Admin: All. Buyer: Own orders only (BR-AUTH-008)
 */
const listOrders = async (req, res) => {
  try {
    const { status, event_id, page = 1, limit = 20 } = req.query;
    const isAdmin = req.user.role === 'admin';

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      let query = supabase
        .from('orders')
        .select('*, buyer:users(id, name, email), event:events(id, title, city), zone:ticket_zones(id, name)', {
          count: 'exact',
        });

      if (!isAdmin) {
        query = query.eq('buyer_id', req.user.id);
      }

      if (status) query = query.eq('status', status);
      if (event_id) query = query.eq('event_id', event_id);

      const from = (page - 1) * limit;
      const to = from + parseInt(limit) - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, count, error: dbError } = await query;
      if (dbError) return error(res, dbError.message, 500);

      return paginated(res, data, page, limit, count || 0);
    }

    return paginated(res, [], page, limit, 0);
  } catch (err) {
    return error(res, 'Gagal memuat pesanan.', 500, err.message);
  }
};

/**
 * Get order detail
 */
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*, buyer:users(*), event:events(*), zone:ticket_zones(*), tickets(*), payments(*)')
        .eq('id', id)
        .single();

      if (dbError || !data) return error(res, 'Pesanan tidak ditemukan.', 404);

      // Ownership check for buyer (BR-AUTH-008)
      if (req.user.role !== 'admin' && data.buyer_id !== req.user.id) {
        return error(res, 'Akses ditolak: Anda tidak memiliki akses ke pesanan ini.', 403);
      }

      return success(res, data, 'Detail pesanan berhasil diambil.');
    }

    return success(res, { id, status: 'waiting_payment' }, 'Detail pesanan (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal memuat detail pesanan.', 500, err.message);
  }
};

/**
 * Cancel Order (FR-ORD-003)
 * BR-ORD-008: Pembeli membatalkan pesanan waiting_payment. Melepas kuota seketika.
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data: orderData } = await supabase.from('orders').select('*').eq('id', id).single();
      if (!orderData) return error(res, 'Pesanan tidak ditemukan.', 404);

      if (req.user.role !== 'admin' && orderData.buyer_id !== req.user.id) {
        return error(res, 'Akses ditolak.', 403);
      }

      if (orderData.status !== 'waiting_payment') {
        return error(
          res,
          `Pesanan tidak dapat dibatalkan karena berstatus ${orderData.status}. Hanya status Menunggu Pembayaran yang dapat dibatalkan (BR-ORD-008).`,
          400
        );
      }

      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (updateError) return error(res, updateError.message, 500);

      return success(res, data, 'Pesanan berhasil dibatalkan dan kuota telah dilepaskan.');
    }

    return success(res, { id, status: 'cancelled' }, 'Pesanan berhasil dibatalkan (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal membatalkan pesanan.', 500, err.message);
  }
};

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  cancelOrder,
};
