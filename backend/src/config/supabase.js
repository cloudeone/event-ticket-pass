const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Supabase client dengan service role key
 * Digunakan untuk operasi backend yang membutuhkan akses penuh
 */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Supabase client dengan anon key
 * Digunakan untuk operasi yang membutuhkan RLS
 */
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = { supabase, supabaseAnon };
