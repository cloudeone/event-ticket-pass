const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');

/**
 * List ticket zones for an event (FR-TKC-001)
 */
const listZones = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('ticket_zones')
        .select('*')
        .eq('event_id', eventId)
        .order('price', { ascending: true });

      if (dbError) return error(res, dbError.message, 500);
      return success(res, data, 'Daftar zona tiket berhasil diambil.');
    }

    return success(
      res,
      [
        { id: 'zone-1', event_id: eventId, name: 'VIP', price: 1500000, quota: 200, is_active: true },
        { id: 'zone-2', event_id: eventId, name: 'Regular', price: 350000, quota: 3000, is_active: true },
      ],
      'Daftar zona tiket berhasil diambil (Demo Mode).'
    );
  } catch (err) {
    return error(res, 'Gagal memuat zona tiket.', 500, err.message);
  }
};

/**
 * Create Ticket Zone (FR-TKC-001)
 */
const createZone = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description, price, quota, sale_start, sale_end } = req.body;

    if (!name || !price || !quota) {
      return error(res, 'Nama zona, harga, dan kuota wajib diisi.', 400);
    }

    if (price <= 0) {
      return error(res, 'Harga tiket harus lebih dari 0 Rupiah (BR-TKC-002).', 400);
    }

    if (quota < 1) {
      return error(res, 'Kuota tiket minimal 1.', 400);
    }

    const defaultSaleStart = sale_start || new Date().toISOString();
    const defaultSaleEnd = sale_end || new Date(Date.now() + 86400000 * 365).toISOString();

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('ticket_zones')
        .insert([
          {
            event_id: eventId,
            name,
            description,
            price: parseInt(price),
            quota: parseInt(quota),
            sale_start: defaultSaleStart,
            sale_end: defaultSaleEnd,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (dbError) {
        if (dbError.code === '23505') {
          return error(res, 'Nama zona sudah ada pada acara ini (BR-TKC-007).', 409);
        }
        return error(res, dbError.message, 500);
      }

      return success(res, data, 'Zona tiket berhasil ditambahkan.', 201);
    }

    const mockZone = {
      id: `zone-${Date.now()}`,
      event_id: eventId,
      name,
      description,
      price: parseInt(price),
      quota: parseInt(quota),
      is_active: true,
    };

    return success(res, mockZone, 'Zona tiket berhasil ditambahkan (Demo Mode).', 201);
  } catch (err) {
    return error(res, 'Gagal menambahkan zona tiket.', 500, err.message);
  }
};

/**
 * Update Zone (FR-TKC-002)
 * BR-TKC-003: Kuota tidak boleh kurang dari (terjual + dikunci)
 */
const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quota, is_active } = req.body;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      if (quota !== undefined) {
        // Count sold and pending
        const { data: paidOrders } = await supabase
          .from('orders')
          .select('quantity')
          .eq('ticket_zone_id', id)
          .eq('status', 'paid');

        const sold = (paidOrders || []).reduce((sum, o) => sum + o.quantity, 0);

        if (quota < sold) {
          return error(
            res,
            `Kuota tidak boleh diturunkan di bawah jumlah yang sudah terjual (${sold} tiket) (BR-TKC-003).`,
            400
          );
        }
      }

      const { data, error: dbError } = await supabase
        .from('ticket_zones')
        .update({ name, description, price, quota, is_active })
        .eq('id', id)
        .select()
        .single();

      if (dbError) return error(res, dbError.message, 500);
      return success(res, data, 'Zona tiket berhasil diperbarui.');
    }

    return success(res, { id, ...req.body }, 'Zona tiket berhasil diperbarui (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal memperbarui zona tiket.', 500, err.message);
  }
};

/**
 * Deactivate / Delete Zone (FR-TKC-003)
 * BR-TKC-005: Zona yang punya pesanan tidak dihapus, hanya dinonaktifkan
 */
const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('ticket_zone_id', id);

      if (count && count > 0) {
        // Automatically deactivate instead of hard delete
        await supabase.from('ticket_zones').update({ is_active: false }).eq('id', id);
        return success(
          res,
          null,
          'Zona memiliki riwayat pesanan sehingga otomatis dinonaktifkan, bukan dihapus (BR-TKC-005).'
        );
      }

      const { error: dbError } = await supabase.from('ticket_zones').delete().eq('id', id);
      if (dbError) return error(res, dbError.message, 500);

      return success(res, null, 'Zona tiket berhasil dihapus.');
    }

    return success(res, null, 'Zona tiket berhasil dihapus (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal menghapus zona tiket.', 500, err.message);
  }
};

module.exports = {
  listZones,
  createZone,
  updateZone,
  deleteZone,
};
