const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://gsidmhliqzyntcjwzasg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaWRtaGxpcXp5bnRjand6YXNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgzNjc5OSwiZXhwIjoyMDU4NDEyNzk5fQ.0Izrf9fo4vojeieWgqNL5ZPJv60N0-omncyhCYiXaLs');
async function test() {
  const { data, error } = await supabase.from('ortopedas_participants').select('*').limit(1);
  console.log(error);
}
test();
