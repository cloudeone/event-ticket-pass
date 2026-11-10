const { supabase } = require('../config/supabase');
const { success, error, paginated } = require('../utils/response');

/**
 * List events (FR-DSC-001 / FR-EVT-003)
 * Admin: All statuses. Buyer: Only 'active' and not ended.
 */
const listEvents = async (req, res) => {
  try {
    const { status, city, category_id, search, page = 1, limit = 20 } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      let query = supabase.from('events').select('*, category:event_categories(*)', { count: 'exact' });

      if (!isAdmin) {
        // Buyer only sees active and unexpired
        query = query.eq('status', 'active').gt('end_date', new Date().toISOString());
      } else if (status) {
        query = query.eq('status', status);
      }

      if (city) query = query.ilike('city', `%${city}%`);
      if (category_id) query = query.eq('category_id', category_id);
      if (search) query = query.ilike('title', `%${search}%`);

      const from = (page - 1) * limit;
      const to = from + parseInt(limit) - 1;
      query = query.order('start_date', { ascending: true }).range(from, to);

      const { data, count, error: dbError } = await query;
      if (dbError) return error(res, 'Gagal mengambil data acara: ' + dbError.message, 500);

      return paginated(res, data, page, limit, count || 0);
    }

    // Demo Mock Fallback
    const mockEvents = [
      {
        id: 'evt-001',
        title: 'Konser Nusantara 2027',
        description: 'Konser musik spektakuler menghadirkan artis ternama Indonesia.',
        start_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 30 + 14400000).toISOString(),
        venue: 'Stadion Utama Gelora Bung Karno',
        address: 'Jl. Pintu Satu Senayan, Gelora',
        city: 'Jakarta',
        status: 'active',
        created_at: new Date().toISOString(),
      },
      {
        id: 'evt-002',
        title: 'Tech Innovation Summit 2027',
        description: 'Konferensi teknologi tahunan AI, Cloud, dan Cybersecurity.',
        start_date: new Date(Date.now() + 86400000 * 60).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 61).toISOString(),
        venue: 'Trans Convention Centre',
        address: 'Jl. Gatot Subroto No.289',
        city: 'Bandung',
        status: 'draft',
        created_at: new Date().toISOString(),
      },
      {
        id: 'evt-003',
        title: 'Pesta Seni & Budaya Nusantara',
        description: 'Pameran kesenian tradisional dan modern.',
        start_date: new Date(Date.now() - 86400000 * 5).toISOString(),
        end_date: new Date(Date.now() - 86400000 * 3).toISOString(),
        venue: 'Bali Nusa Dua Convention Center',
        address: 'Kawasan ITDC Lot C-0',
        city: 'Bali',
        status: 'archived',
        created_at: new Date().toISOString(),
      },
    ];

    let result = mockEvents;
    if (!isAdmin) {
      result = result.filter((e) => e.status === 'active');
    } else if (status) {
      result = result.filter((e) => e.status === status);
    }

    return paginated(res, result, page, limit, result.length);
  } catch (err) {
    return error(res, 'Gagal memuat acara.', 500, err.message);
  }
};

/**
 * Get Event Detail (FR-DSC-001)
 */
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('events')
        .select('*, category:event_categories(*), zones:ticket_zones(*)')
        .eq('id', id)
        .single();

      if (dbError || !data) return error(res, 'Acara tidak ditemukan.', 404);
      return success(res, data, 'Detail acara berhasil diambil.');
    }

    return success(
      res,
      {
        id,
        title: 'Konser Nusantara 2027',
        description: 'Konser musik spektakuler Indonesia.',
        start_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 30 + 14400000).toISOString(),
        venue: 'Stadion Utama Gelora Bung Karno',
        city: 'Jakarta',
        status: 'active',
        zones: [
          { id: 'zone-1', name: 'VIP', price: 1500000, quota: 200, sold: 45, remaining: 155 },
          { id: 'zone-2', name: 'Festival Regular', price: 350000, quota: 3000, sold: 1200, remaining: 1800 },
        ],
      },
      'Detail acara berhasil diambil (Demo Mode).'
    );
  } catch (err) {
    return error(res, 'Gagal memuat detail acara.', 500, err.message);
  }
};

/**
 * Create Event (FR-EVT-001)
 * Status awal selalu DRAF (BR-EVT-001)
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, category_id, start_date, end_date, venue, address, city } = req.body;

    // BR-EVT-002: end_date must be after start_date
    if (new Date(end_date) <= new Date(start_date)) {
      return error(res, 'Tanggal selesai harus setelah tanggal mulai acara (BR-EVT-002).', 400);
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            category_id: category_id || null,
            start_date,
            end_date,
            venue,
            address,
            city,
            status: 'draft', // BR-EVT-001
            created_by: req.user.id,
          },
        ])
        .select()
        .single();

      if (dbError) return error(res, 'Gagal membuat acara: ' + dbError.message, 500);
      return success(res, data, 'Acara baru berhasil dibuat dengan status Draf.', 201);
    }

    const mockEvent = {
      id: `evt-${Date.now()}`,
      title,
      description,
      start_date,
      end_date,
      venue,
      address,
      city,
      status: 'draft',
      created_by: req.user.id,
      created_at: new Date().toISOString(),
    };

    return success(res, mockEvent, 'Acara baru berhasil dibuat (Demo Mode).', 201);
  } catch (err) {
    return error(res, 'Gagal membuat acara.', 500, err.message);
  }
};

/**
 * Update Event (FR-EVT-001)
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.start_date && updates.end_date) {
      if (new Date(updates.end_date) <= new Date(updates.start_date)) {
        return error(res, 'Tanggal selesai harus setelah tanggal mulai acara.', 400);
      }
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (dbError) return error(res, 'Gagal memperbarui acara: ' + dbError.message, 500);
      return success(res, data, 'Data acara berhasil diperbarui.');
    }

    return success(res, { id, ...updates }, 'Data acara berhasil diperbarui (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal memperbarui acara.', 500, err.message);
  }
};

/**
 * Activate Event (FR-EVT-002)
 * BR-EVT-003: Acara harus memiliki minimal 1 zona aktif
 */
const activateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      // Check zones
      const { count, error: zoneError } = await supabase
        .from('ticket_zones')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id)
        .eq('is_active', true);

      if (zoneError) return error(res, zoneError.message, 500);
      if (!count || count < 1) {
        return error(res, 'Acara harus memiliki minimal 1 zona tiket aktif sebelum dapat diaktifkan (BR-EVT-003).', 400);
      }

      const { data, error: updateError } = await supabase
        .from('events')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();

      if (updateError) return error(res, updateError.message, 500);
      return success(res, data, 'Acara berhasil diaktifkan.');
    }

    return success(res, { id, status: 'active' }, 'Acara berhasil diaktifkan (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal mengaktifkan acara.', 500, err.message);
  }
};

/**
 * Archive Event (FR-EVT-002)
 * BR-EVT-005: Hilang dari katalog, tiket yang sudah dibeli tetap valid
 */
const archiveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('events')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();

      if (dbError) return error(res, dbError.message, 500);
      return success(res, data, 'Acara berhasil diarsipkan.');
    }

    return success(res, { id, status: 'archived' }, 'Acara berhasil diarsipkan (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal mengarsipkan acara.', 500, err.message);
  }
};

/**
 * Delete Event (FR-EVT-003)
 * BR-EVT-004: Acara yang memiliki pesanan tidak boleh dihapus, hanya diarsipkan
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      if (count && count > 0) {
        return error(
          res,
          'Acara yang sudah memiliki pesanan tidak dapat dihapus. Silakan gunakan fitur arsip (BR-EVT-004).',
          400
        );
      }

      const { error: dbError } = await supabase.from('events').delete().eq('id', id);
      if (dbError) return error(res, dbError.message, 500);

      return success(res, null, 'Acara berhasil dihapus.');
    }

    return success(res, null, 'Acara berhasil dihapus (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal menghapus acara.', 500, err.message);
  }
};

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  activateEvent,
  archiveEvent,
  deleteEvent,
};
