
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://imiumbgutmahmhhasqgf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaXVtYmd1dG1haG1oaGFzcWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjI3ODEsImV4cCI6MjA3OTIzODc4MX0.vC5hAD23Qpn0HYlMZLVW8H9y0ZIhtaQp-uqAsyVFDF8';

// Simple validation to prevent crash if keys are missing/default
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!isValidUrl(SUPABASE_URL) || SUPABASE_URL.includes('YOUR_SUPABASE_URL')) {
  console.warn('Supabase URL is not configured correctly. Please update supabaseClient.ts');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
