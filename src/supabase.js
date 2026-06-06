const { createClient } = require('@supabase/supabase-js');

// Anon client — for public inserts (mirrors what the frontend does)
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Service-role client — bypasses RLS, used for admin reads and webhook updates
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

module.exports = { supabaseAnon, supabaseAdmin };
