// return a supabase client

import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = "https://vqbbbakeppjwqipnapnw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYmJiYWtlcHBqd3FpcG5hcG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTAzNjMsImV4cCI6MjA2MzIyNjM2M30.nS936xJbanFVSrexsLXGJOamgaZfvRLxRnBq2IUpHAk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);