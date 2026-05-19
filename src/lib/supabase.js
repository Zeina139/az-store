import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gejeayfmymmsiysrrbcs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamVheWZteW1tc2l5c3JyYmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTMwMzUsImV4cCI6MjA4ODU4OTAzNX0.XMIqIvVnLcF-iPVw_DsIiVfr7cdf8vzrImXW4zrfXuY";

export const supabase = createClient(supabaseUrl, supabaseKey);
