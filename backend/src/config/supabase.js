const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let supabaseAnon = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn('[Supabase Config] PERINGATAN: SUPABASE_URL atau SUPABASE_SERVICE_KEY belum disetel. Backend berjalan dalam mode Demo/Mock.');
}

if (supabaseUrl && supabaseAnonKey) {
  supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = { supabase, supabaseAnon };
