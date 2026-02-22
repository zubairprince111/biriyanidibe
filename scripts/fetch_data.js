const https = require('https');

const supabaseUrl = "https://oocatxnnyhlqfptnmeom.supabase.co/rest/v1/biriyani_spots?select=*";
const apiKey = "sb_publishable_9BnnwG33sBufFaFnvuo1bg_JQ4Vk9dt";

const options = {
    headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
    }
};

https.get(supabaseUrl, options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
