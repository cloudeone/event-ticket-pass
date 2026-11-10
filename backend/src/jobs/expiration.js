const { supabase } = require('../config/supabase');

/**
 * Background job untuk membersihkan reservasi pesanan yang kedaluwarsa
 * FR-ORD-002, BR-ORD-007, NFR-REL-002
 */
const cleanupExpiredOrders = async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return;

    const now = new Date().toISOString();
    const { data: expiredList, error } = await supabase
      .from('orders')
      .update({ status: 'expired' })
      .eq('status', 'waiting_payment')
      .lt('expires_at', now)
      .select('id, order_number');

    if (error) {
      console.error('[ExpirationJob] Gagal memperbarui pesanan kedaluwarsa:', error.message);
    } else if (expiredList && expiredList.length > 0) {
      console.log(`[ExpirationJob] ${expiredList.length} pesanan kedaluwarsa diperbarui.`);
    }
  } catch (err) {
    console.error('[ExpirationJob] Error:', err.message);
  }
};

/**
 * Jalankan interval pembersihan setiap 60 detik
 */
const startExpirationJob = (intervalMs = 60000) => {
  // Jalankan segera sekali saat startup
  cleanupExpiredOrders();
  const timer = setInterval(cleanupExpiredOrders, intervalMs);
  return timer;
};

module.exports = {
  cleanupExpiredOrders,
  startExpirationJob,
};
