const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');

/**
 * Get Dashboard Metrics (FR-RPT-002, BR-RPT-001 s.d. 006)
 */
const getDashboardMetrics = async (req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      // 1. Total Pendapatan & Tiket Terjual from paid orders
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_price, quantity, event_id')
        .eq('status', 'paid');

      const totalRevenue = (paidOrders || []).reduce((sum, o) => sum + (o.total_price || 0), 0);
      const ticketsSold = (paidOrders || []).reduce((sum, o) => sum + (o.quantity || 0), 0);

      // 2. Tiket Dikunci (waiting_payment and expires_at > now)
      const now = new Date().toISOString();
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('quantity, event_id')
        .eq('status', 'waiting_payment')
        .gt('expires_at', now);

      const ticketsLocked = (pendingOrders || []).reduce((sum, o) => sum + (o.quantity || 0), 0);

      // 3. Total Check-in (tickets status = used)
      const { count: totalCheckIns } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'used');

      // 4. Per-event breakdown
      const { data: events } = await supabase
        .from('events')
        .select('id, title, zones:ticket_zones(quota)')
        .order('created_at', { ascending: false });

      const eventSummaries = (events || []).map((evt) => {
        const totalQuota = (evt.zones || []).reduce((sum, z) => sum + (z.quota || 0), 0);
        const evtPaid = (paidOrders || []).filter((o) => o.event_id === evt.id);
        const evtPending = (pendingOrders || []).filter((o) => o.event_id === evt.id);

        const rev = evtPaid.reduce((sum, o) => sum + (o.total_price || 0), 0);
        const sold = evtPaid.reduce((sum, o) => sum + (o.quantity || 0), 0);
        const locked = evtPending.reduce((sum, o) => sum + (o.quantity || 0), 0);

        return {
          event_id: evt.id,
          event_title: evt.title,
          total_quota: totalQuota,
          sold,
          locked,
          revenue: rev,
          check_ins: 0,
        };
      });

      return success(
        res,
        {
          total_revenue: totalRevenue,
          tickets_sold: ticketsSold,
          tickets_locked: ticketsLocked,
          total_check_ins: totalCheckIns || 0,
          event_summaries: eventSummaries,
        },
        'Metrik dasbor berhasil dihitung.'
      );
    }

    // Demo Mode Fallback
    return success(
      res,
      {
        total_revenue: 8175000,
        tickets_sold: 10964,
        tickets_locked: 23,
        total_check_ins: 6489,
        event_summaries: [
          {
            event_id: 'evt-001',
            event_title: 'Konser Nusantara 2027',
            total_quota: 6200,
            sold: 4632,
            locked: 12,
            revenue: 4965000000,
            check_ins: 0,
          },
        ],
      },
      'Metrik dasbor (Demo Mode).'
    );
  } catch (err) {
    return error(res, 'Gagal menghitung metrik dasbor.', 500, err.message);
  }
};

module.exports = {
  getDashboardMetrics,
};
