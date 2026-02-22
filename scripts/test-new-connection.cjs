const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://oocatxnnyhlqfptnmeom.supabase.co";
const SUPABASE_KEY = "sb_publishable_9BnnwG33sBufFaFnvuo1bg_JQ4Vk9dt";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
    console.log("Attempting to insert a test spot...");
    const testSpot = {
        masjid_name: "Test Masjid",
        area: "Test Area",
        food_type: "Tehari",
        lat: 23.8103,
        lng: 90.4125
    };

    const { data, error } = await supabase
        .from('biriyani_spots')
        .insert(testSpot)
        .select();

    if (error) {
        console.error("Insert Error:", error);
    } else {
        console.log("Success! Inserted spot:", data);
    }
}

testInsert();
