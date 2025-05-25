// backend/routes/linkedin.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

const pool = require('./../config/db.js');


router.get('/auth/linkedin', (req, res) => {
  const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
  const scope = 'openid profile email';
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
});

router.get('/linkedinCallback', async (req, res) => {
    const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

    // Exchange code for tokens
    const code = req.query.code;

    // Validate code
    if (!code) {
        res.redirect('http://localhost:5173/');
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
        params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

  const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
    headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
    }
  });

  const userInfo = userResponse.data;

  // Store user data
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
  res.redirect('http://localhost:5173/home');
});

async function checkUser(userInfo) {
    const query = 'SELECT * FROM public.users WHERE email = $1 AND provider = $2';
    
    const response = await pool.query(query, [userInfo.email, 'linkedin']);
    return response.rows[0];
}

async function createUser(userInfo) {
    const query = 'INSERT INTO public.users (provider, provider_user_id, email, full_name, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *';

    const res = await pool.query(query, ['linkedin', userInfo.sub, userInfo.email, userInfo.name])

    return res.rows[0];
}

async function updateUser(userInfo) {
    const query = 'UPDATE public.users SET updated_at = NOW() WHERE email = $1 and provider = $2 RETURNING *';

    const res = await pool.query(query, [userInfo.email, 'linkedin']);

    return res.rows[0];
}

module.exports = router;