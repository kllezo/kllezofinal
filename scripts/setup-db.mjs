#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// KLLEZO — Supabase DB Setup Script
// Applies the migration SQL using the Supabase Management API.
//
// Usage:
//   SUPABASE_ACCESS_TOKEN=<your_personal_access_token> node scripts/setup-db.mjs
//
// Get your token at: https://app.supabase.com/account/tokens
// ═══════════════════════════════════════════════════════════════════

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

import dotenv from 'dotenv'
dotenv.config({ path: join(__dirname, '..', '.env.local') })
dotenv.config({ path: join(__dirname, '..', '.env') }) // fallback

const PROJECT_REF      = 'jvijbbhmrtwaqckvwhae'
const ACCESS_TOKEN     = process.env.SUPABASE_ACCESS_TOKEN
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jvijbbhmrtwaqckvwhae.supabase.co'

// Read the migration SQL file
const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '20260525000000_create_applications.sql')
const sql     = readFileSync(sqlPath, 'utf8')

async function runViaManagementAPI() {
  if (!ACCESS_TOKEN) {
    throw new Error('SUPABASE_ACCESS_TOKEN not set. Get it from https://app.supabase.com/account/tokens')
  }

  console.log('🚀 Applying migration via Supabase Management API...')

  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Management API failed (${res.status}): ${body}`)
  }

  return await res.json()
}

async function testConnection() {
  console.log('\n🔌 Testing Supabase connection...')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=count`, {
    headers: {
      'apikey':        SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'count=exact',
    },
  })

  if (res.ok) {
    const count = res.headers.get('content-range') || '0'
    console.log(`✅ Connection OK — applications table exists. Row count: ${count}`)
    return true
  } else {
    const body = await res.text()
    console.log(`⚠️  Table check response (${res.status}): ${body}`)
    return false
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('  KLLEZO — Supabase Database Setup')
  console.log('═══════════════════════════════════════════════\n')

  // First try to connect and check if table already exists
  const tableExists = await testConnection()

  if (tableExists) {
    console.log('\n✅ Schema already applied — nothing to do.')
    return
  }

  // Apply migration
  try {
    await runViaManagementAPI()
    console.log('✅ Migration applied successfully!\n')
    await testConnection()
  } catch (err) {
    console.error('\n❌ Error:', err.message)
    console.error('\n📋 Manual fallback: copy and run this SQL in the Supabase SQL Editor:')
    console.error('   https://app.supabase.com/project/jvijbbhmrtwaqckvwhae/sql/new\n')
    process.exit(1)
  }
}

main()
