// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate URL format
if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('Supabase URL is not configured properly');
}

if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-key') {
  console.error('Supabase Anon Key is not configured properly');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

