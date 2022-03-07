import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://zbosbkrfpoepanxpcyxx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpib3Nia3JmcG9lcGFueHBjeXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY2MDIwOTksImV4cCI6MTk2MjE3ODA5OX0.tAtYEYZeqgiPIW_EGaQNJUeYvdOiUnWbbR3nsnHSHn8";


export const supabase = createClient(supabaseUrl, supabaseAnonKey)