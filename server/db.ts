
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local or .env in the parent directory if not found in current? 
// Actually, usually we put .env in server/ for backend.
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  // We don't throw here to allow the server to start even with missing config, 
  // but APIs will fail. This helps with debugging.
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
