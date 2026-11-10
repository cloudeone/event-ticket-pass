const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');
const { generateTicketCode, generateQRToken } = require('../utils/format');

/**
 * Simulasi Pembayaran (FR-PAY-001, FR-PAY-002, FR-PAY-003)
 */
const simulatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, idempotency_key } = req.body; // 'success' | 'failed' | 'cancel'

    if (!action || !['success', 'failed', 'cancel'].includes(action)) {
      return error(res, 'Aksi pembayaran tidak valid. Pilihan: success, failed, cancel.', 400);
    }

    if (!idempotency_key) {
      return error(res, 'Kunci idempotensi (idempotency_key) wajib disertakan.', 400);
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      // 1. Check if payment with this idempotency key already exists
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('idempotency_key', idempotency_key)
        .single();

      if (existingPayment) {
        return success(
          res,
          existingPayment,
          'Pembayaran ini sudah pernah diproses (Respons Idempoten).'
        );
      }

      // 2. Fetch order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderErr || !order) return error(res, 'Pesanan tidak ditemukan.', 404);

      // Check ownership
      if (req.user.role !== 'admin' && order.buyer_id !== req.user.id) {
        return error(res, 'Akses ditolak: Anda bukan pemilik pesanan ini.', 403);
      }

      // Check terminal status (BR-ORD-010)
      if (order.status === 'paid') {
        return error(res, 'Pesanan ini sudah berhasil dibayar (BR-PAY-005).', 400);
      }
      if (order.status === 'cancelled') {
        return error(res, 'Pesanan ini sudah dibatalkan.', 400);
      }
      if (order.status === 'expired') {
        return error(res, 'Batas waktu pesanan telah habis (Kedaluwarsa).', 400);
      }

      // BR-PAY-008: Check timeout
      if (new Date() > new Date(order.expires_at)) {
        await supabase.from('orders').update({ status: 'expired' }).eq('id', orderId);
        return error(
          res,
          'Batas waktu pembayaran 10 menit telah habis. Kuota telah dilepaskan (BR-PAY-008).',
          400
        );
      }

      // 3. Handle Actions
      if (action === 'cancel') {
        // BR-PAY-004: Batalkan
        await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
        return success(res, { status: 'cancelled' }, 'Pesanan berhasil dibatalkan dan kuota dilepas.');
      }

      if (action === 'failed') {
        // BR-PAY-003: Bayar Gagal
        await supabase.from('payments').insert([
          {
            order_id: orderId,
            status: 'failed',
            idempotency_key,
          },
        ]);

        return success(
          res,
          { order_status: 'waiting_payment', payment_status: 'failed' },
          'Simulasi pembayaran gagal tercatat. Anda dapat mencoba kembali sebelum waktu habis (BR-PAY-003).'
        );
      }

      if (action === 'success') {
        // BR-PAY-002: Bayar Berhasil
        // Record payment
        await supabase.from('payments').insert([
          {
            order_id: orderId,
            status: 'success',
            idempotency_key,
          },
        ]);

        // Update order to paid
        await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);

        // Issue tickets (FR-TIX-001)
        const ticketsToCreate = [];
        for (let i = 0; i < order.quantity; i++) {
          ticketsToCreate.push({
            ticket_code: generateTicketCode(),
            qr_token: generateQRToken(),
            order_id: order.id,
            event_id: order.event_id,
            ticket_zone_id: order.ticket_zone_id,
            owner_id: order.buyer_id,
            status: 'active',
          });
        }

        const { data: createdTickets, error: tktErr } = await supabase
          .from('tickets')
          .insert(ticketsToCreate)
          .select();

        if (tktErr) return error(res, 'Gagal menerbitkan tiket: ' + tktErr.message, 500);

        return success(
          res,
          {
            order_status: 'paid',
            payment_status: 'success',
            tickets: createdTickets,
          },
          'Pembayaran simulasi berhasil! Tiket QR digital Anda telah diterbitkan.',
          200
        );
      }
    }

    // Demo Mode Fallback
    const mockTickets = Array.from({ length: 2 }).map(() => ({
      ticket_code: generateTicketCode(),
      qr_token: generateQRToken(),
      status: 'active',
    }));

    return success(
      res,
      {
        order_status: action === 'success' ? 'paid' : action === 'cancel' ? 'cancelled' : 'waiting_payment',
        payment_status: action,
        tickets: action === 'success' ? mockTickets : [],
      },
      `Simulasi pembayaran ${action} berhasil diproses (Demo Mode).`
    );
  } catch (err) {
    return error(res, 'Gagal memproses simulasi pembayaran.', 500, err.message);
  }
};

module.exports = {
  simulatePayment,
};
