#!/usr/bin/env node
// ─── KLLEZO — Supabase Connection Test ──────────────────────────────────────
// Run: node scripts/test-connection.mjs
// Tests both anon key (public) and service role key (admin) connections.

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })
dotenv.config({ path: path.join(__dirname, '..', '.env') }) // fallback

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testKey(label, key) {
  console.log(`\n🔑 Testing: ${label}`)
  try {
    // Test 1: Can we reach Supabase?
    const pingRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    })
    console.log(`   Ping: ${pingRes.ok ? '✅ OK' : `❌ ${pingRes.status}`}`)

    // Test 2: Does the applications table exist?
    const tableRes = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=id&limit=1`, {
      headers: {
        'apikey':        key,
        'Authorization': `Bearer ${key}`,
        'Content-Type':  'application/json',
        'Prefer':        'count=exact',
      }
    })
    const body = await tableRes.text()
    if (tableRes.ok) {
      const count = tableRes.headers.get('content-range') || '?'
      console.log(`   applications table: ✅ EXISTS — count: ${count}`)
    } else {
      console.log(`   applications table: ❌ NOT FOUND (${tableRes.status}) — ${body.slice(0, 120)}`)
      if (tableRes.status === 404 || body.includes('does not exist')) {
        console.log(`\n   ⚠️  Table missing. Run the migration SQL in Supabase dashboard:`)
        console.log(`   → https://app.supabase.com/project/jvijbbhmrtwaqckvwhae/sql/new`)
        console.log(`   → File: supabase/migrations/20260525000000_create_applications.sql`)
      }
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`)
  }
}

async function testInsert() {
  console.log(`\n📝 Test INSERT (anon key — simulates frontend form)`)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
      method: 'POST',
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=representation',
      },
      body: JSON.stringify({
        full_name:     'Test User',
        business_name: 'Test Co',
        email:         'test@kllezo.com',
        phone:         '+91 00000 00000',
        purpose:       'content,website',
        stage:         'starting',
        bottleneck:    'attention',
        details:       'This is an automated connection test — safe to delete.',
        source:        'test-script',
      })
    })
    const body = await res.text()
    if (res.ok) {
      console.log(`   ✅ INSERT successful! Row saved to Supabase.`)
      console.log(`   Record: ${body.slice(0, 200)}`)
    } else {
      console.log(`   ❌ INSERT failed (${res.status}): ${body.slice(0, 200)}`)
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`)
  }
}

console.log('═══════════════════════════════════════════════')
console.log('  KLLEZO — Supabase Connection Test')
console.log('═══════════════════════════════════════════════')

await testKey('Anon Key (frontend)', SUPABASE_ANON_KEY)
await testKey('Service Role Key (admin)', SERVICE_ROLE_KEY)
await testInsert()

console.log('\n═══════════════════════════════════════════════')
console.log('  Done.')
console.log('═══════════════════════════════════════════════\n')
