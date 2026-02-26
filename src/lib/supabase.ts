import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gsidmhliqzyntcjwzasg.supabase.co';
// Using the service key for full admin access inside server components or simple inserts if RLS is not fully configured by user.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaWRtaGxpcXp5bnRjand6YXNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgzNjc5OSwiZXhwIjoyMDU4NDEyNzk5fQ.0Izrf9fo4vojeieWgqNL5ZPJv60N0-omncyhCYiXaLs';

export const supabase = createClient(supabaseUrl, supabaseKey);
