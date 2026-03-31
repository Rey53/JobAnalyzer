import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mysupa.servicioxpert.com'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzM4ODg0NzIsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.BfF_As2-X-NBoDh2RnojWRIw3r1XjIEgfM8quNhtKXI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
