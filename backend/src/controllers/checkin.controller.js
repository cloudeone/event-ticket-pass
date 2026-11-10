const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');

/**
 * Validasi QR dan Pencatatan Check-in (FR-CHK-001)
 * BR-CHK-001 s.d. 008
 */
const validateCheckIn = async (req, res) => {
  try {
    const { qr_token, event_id } = req.body;
    const staff_id = req.user.id;

    if (!qr_token || !event_id) {
      return error(res, 'Token QR (qr_token) dan ID acara (event_id) wajib disertakan.', 400);
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      // 1. Check event status (BR-CHK-004: draft events cannot be checked in)
      const { data: eventData } = await supabase
        .from('events')
        .select('id, title, status')
        .eq('id', event_id)
        .single();

      if (!eventData || eventData.status === 'draft') {
        return success(res, {
          result: 'TIDAK_VALID',
          message: 'Acara belum aktif atau berstatus Draf (BR-CHK-004).',
        });
      }

      // 2. Find ticket by qr_token
      const { data: ticket, error: tktErr } = await supabase
        .from('tickets')
        .select('*, event:events(title), zone:ticket_zones(name), owner:users(name)')
        .eq('qr_token', qr_token)
        .single();

      if (tktErr || !ticket) {
        return success(res, {
          result: 'TIDAK_VALID',
          message: 'Token QR tidak terdaftar dalam sistem.',
        });
      }

      // 3. BR-CHK-003: Must match selected event
      if (ticket.event_id !== event_id) {
        return success(res, {
          result: 'TIDAK_VALID',
          message: `Tiket ini bukan untuk acara ini (terdaftar untuk "${ticket.event?.title || 'acara lain'}").`,
        });
      }

      // 4. BR-CHK-001: Already used?
      if (ticket.status === 'used') {
        return success(res, {
          result: 'SUDAH_DIPAKAI',
          message: 'Tiket ini sudah pernah digunakan sebelumnya.',
          previous_check_in: {
            checked_in_at: ticket.checked_in_at,
            checked_in_by: ticket.checked_in_by,
          },
        });
      }

      // 5. Atomic check-in (BR-CHK-007)
      const now = new Date().toISOString();
      const { data: updatedTicket, error: updateErr } = await supabase
        .from('tickets')
        .update({
          status: 'used',
          checked_in_at: now,
          checked_in_by: staff_id,
        })
        .eq('id', ticket.id)
        .eq('status', 'active') // Concurrency lock
        .select()
        .single();

      if (updateErr || !updatedTicket) {
        return success(res, {
          result: 'SUDAH_DIPAKAI',
          message: 'Tiket baru saja divalidasi oleh petugas lain.',
        });
      }

      return success(res, {
        result: 'VALID',
        message: 'Tiket valid! Akses masuk disetujui.',
        ticket: {
          id: ticket.id,
          ticket_code: ticket.ticket_code,
          status: 'used',
          checked_in_at: now,
          zone_name: ticket.zone?.name,
          event_title: ticket.event?.title,
          owner_name: ticket.owner?.name,
        },
      });
    }

    // Demo Mode Fallback: Demonstrate VALID vs SUDAH_DIPAKAI
    if (qr_token.includes('used')) {
      return success(res, {
        result: 'SUDAH_DIPAKAI',
        message: 'Tiket ini sudah pernah digunakan sebelumnya pada 18:45 WIB.',
        previous_check_in: {
          checked_in_at: new Date(Date.now() - 3600000).toISOString(),
        },
      });
    }

    return success(res, {
      result: 'VALID',
      message: 'Tiket valid! Akses masuk disetujui (Demo Mode).',
      ticket: {
        ticket_code: 'TKT-8F2B9C1A-4D3E',
        status: 'used',
        zone_name: 'VIP Pass',
        owner_name: 'Ahmad Rizky Pratama',
      },
    });
  } catch (err) {
    return error(res, 'Gagal memproses validasi check-in.', 500, err.message);
  }
};

/**
 * Daftar acara untuk Petugas Check-in (FR-CHK-002)
 */
const listEventsForCheckIn = async (req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      // Active and archived events
      const { data, error: dbError } = await supabase
        .from('events')
        .select('id, title, venue, city, start_date, status')
        .in('status', ['active', 'archived'])
        .order('start_date', { ascending: false });

      if (dbError) return error(res, dbError.message, 500);
      return success(res, data, 'Daftar acara untuk check-in berhasil diambil.');
    }

    return success(
      res,
      [
        {
          id: 'evt-001',
          title: 'Konser Nusantara 2027',
          venue: 'Stadion Utama GBK',
          city: 'Jakarta',
          status: 'active',
        },
      ],
      'Daftar acara untuk check-in (Demo Mode).'
    );
  } catch (err) {
    return error(res, 'Gagal memuat acara check-in.', 500, err.message);
  }
};

module.exports = {
  validateCheckIn,
  listEventsForCheckIn,
};
