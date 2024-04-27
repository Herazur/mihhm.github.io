const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Discord uygulama ayarları
const CLIENT_ID = '1233795441552920606';
const CLIENT_SECRET = 'bYLkV79W4F6TOgg2UY4W1QM9qKLmGcWC';
const REDIRECT_URI = 'https://herazur.github.io/mihhm.github.io/'; // Discord Developer Portal'da ayarladığınız geri çağırma URL'si

// Discord ile giriş yönlendirme rotası
app.get('/discord/login', (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`);
});

// Discord geri çağırma rotası
app.get('/discord/callback', async (req, res) => {
    const code = req.query.code;

    // Discord API'sinden erişim belirteci al
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        })
    });
    const tokenData = await tokenResponse.json();

    // Discord API'sinden kullanıcı bilgilerini al
    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenData.token_type} ${tokenData.access_token}`
        }
    });
    const userData = await userResponse.json();

    // Kullanıcı bilgilerini göster
    res.json(userData);
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
