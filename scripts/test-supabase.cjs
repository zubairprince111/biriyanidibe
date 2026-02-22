
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://msatsqvfzrarhbycnevg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zYXRzcXZmenJhcmhieWNuZXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDQ2NTYsImV4cCI6MjA4NzA4MDY1Nn0.Gz5OM4sooeuAPJ9HOSNKbJsGDYZEld1En2w8OnI9H1w";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testFetch() {
    console.log("Fetching spots...");
    const { data, error, count } = await supabase
        .from('biriyani_spots')
        .select('*', { count: 'exact' });

    if (error) {
        console.error("Error fetching spots:", error);
    } else {
        console.log("Success! Found", data.length, "spots.");
        console.log("Total count:", count);
        if (data.length > 0) {
            console.log("Sample spot:", data[0]);
        }
    }
}

testFetch();
