import { createClient } from '@supabase/supabase-js';

// Define a local interface to satisfy TypeScript when vite/client types are missing or conflicting
interface ImportMetaEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  [key: string]: any;
}

// Используем переменные окружения VITE_ если они есть, иначе используем хардкод.
// Используем optional chaining (?.), чтобы избежать ошибки "undefined is not an object",
// если import.meta.env не определен в текущей среде исполнения.
const env = (import.meta as unknown as { env: ImportMetaEnv }).env;

const supabaseUrl = env?.VITE_SUPABASE_URL || 'https://xvenylqtnnuastqagvga.supabase.co';
const supabaseKey = env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZW55bHF0bm51YXN0cWFndmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTc3OTMsImV4cCI6MjA3OTY3Mzc5M30.bSavVWv-twAxeQc3naWIxYfs-qxhs4XEfFCBbQ43evo';

export const supabase = createClient(supabaseUrl, supabaseKey);