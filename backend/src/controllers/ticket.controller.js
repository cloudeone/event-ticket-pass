const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');

/**
 * List Buyer Tickets (FR-WAL-002)
 * Buyer only sees own tickets (BR-AUTH-008)
 */
const listTickets = async (req, res) => {
  try {
    const buyer_id = req.user.id;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('tickets')
        .select('*, event:events(id, title, venue, city, start_date), zone:ticket_zones(id, name)')
        .eq('owner_id', buyer_id)
        .order('created_at', { ascending: false });

      if (dbError) return error(res, dbError.message, 500);
      return success(res, data, 'Daftar tiket berhasil diambil.');
    }

    // Demo Mode Fallback
    const mockTickets = [
      {
        id: 'tkt-001',
        ticket_code: 'TKT-8F2B9C1A-4D3E',
        qr_token: '550e8400-e29b-41d4-a716-446655440000',
        status: 'active',
        event: {
          id: 'evt-001',
          title: 'Konser Nusantara 2027',
          venue: 'Stadion Utama GBK',
          city: 'Jakarta',
          start_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        },
        zone: { id: 'zone-1', name: 'VIP Lounge' },
      },
    ];

    return success(res, mockTickets, 'Daftar tiket (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal memuat tiket.', 500, err.message);
  }
};

/**
 * Get Ticket Detail with QR token (FR-WAL-001)
 */
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('tickets')
        .select('*, event:events(*), zone:ticket_zones(*)')
        .eq('id', id)
        .single();

      if (dbError || !data) return error(res, 'Tiket tidak ditemukan.', 404);

      if (req.user.role !== 'admin' && data.owner_id !== req.user.id) {
        return error(res, 'Akses ditolak: Tiket milik pengguna lain.', 403);
      }

      return success(res, data, 'Detail tiket QR berhasil diambil.');
    }

    return success(
      res,
      {
        id,
        ticket_code: 'TKT-8F2B9C1A-4D3E',
        qr_token: '550e8400-e29b-41d4-a716-446655440000',
        status: 'active',
      },
      'Detail tiket QR (Demo Mode).'
    );
  } catch (err) {
    return error(res, 'Gagal memuat detail tiket.', 500, err.message);
  }
};

module.exports = {
  listTickets,
  getTicket,
};
