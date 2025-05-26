// backend/routes/google.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

const pool = require('../config/db.js');

router.get('/auth/google', (req, res) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
  const scope = encodeURIComponent('openid email profile');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&scope=${scope}`;
  
  // console.log(authUrl)
  res.redirect(authUrl);
});

router.get('/googleCallback', async (req, res) => {
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  // Exchange code for tokens
  const code = req.query.code;

  // Validate code
  if (!code) {
    res.redirect('https://nms6950.github.io/sweng861-social-media-login/');
  }

  console.log(process.env.GOOGLE_CLIENT_ID)
  console.log(process.env.GOOGLE_CLIENT_SECRET)

  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenResponse.data.access_token}`
    }
  });

  const userInfo = userResponse.data;

  let user = await checkUser(userInfo);
  if (!user) {
    user = await createUser(userInfo);
  } else {
    user = await updateUser(userInfo);
  }

  // Set cookie
  res.cookie('access_token', tokenResponse.data.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: tokenResponse.data.expires_in
  });

  // Redirect back to "home screen"
  res.redirect('https://nms6950.github.io/sweng861-social-media-login/#/home');
});

async function checkUser(userInfo) {
    const query = 'SELECT * FROM public.users WHERE email = $1 and provider = $2';
    
    const response = await pool.query(query, [userInfo.email, 'google']);
    return response.rows[0];
}

async function createUser(userInfo) {
    const query = 'INSERT INTO public.users (provider, provider_user_id, email, full_name, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *';

    const res = await pool.query(query, ['google', userInfo.id, userInfo.email, userInfo.name])

    return res.rows[0];
}

async function updateUser(userInfo) {
    const query = 'UPDATE public.users SET updated_at = NOW() WHERE email = $1 and provider = $2 RETURNING *';

    const res = await pool.query(query, [userInfo.email, 'google']);

    return res.rows[0];
}

module.exports = router;
