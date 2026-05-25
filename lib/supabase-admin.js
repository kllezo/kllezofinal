// ─── KLLEZO SUPABASE ADMIN CLIENT (Server / Node.js only) ──────────────────
// Uses the SERVICE ROLE key — bypasses Row Level Security.
// ⚠️  NEVER import this file in frontend / browser code.
// Use only in: server actions, API routes, migration scripts, Node.js scripts.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl        = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false
  }
})
