import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

// ---------------------------------------------------------------------------
// Admin client — uses service_role key to bypass Row Level Security.
// NEVER expose this client or its key to the frontend.
// ---------------------------------------------------------------------------
export const supabaseAdmin: SupabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
