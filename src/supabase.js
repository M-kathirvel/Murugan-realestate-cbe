import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eoizceqhfniwxouizyrt.supabase.co';
const supabasePublishableKey = 'sb_publishable_xcwNIVTTR9Gb-SUmkxnmbQ_ZTEYJuJ3';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);