
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Backend warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing. Database operations will fail.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
