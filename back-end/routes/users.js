// backend/routes/google.js

const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const pool = require('../config/db.js');

router.post('/createAccount', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUserQuery = 'SELECT * FROM public.users WHERE email = $1 and provider = $2';
    const insertUserQuery = 'INSERT INTO public.users (provider, email, full_name, created_at, updated_at, password) VALUES ($1, $2, $3, NOW(), NOW(), $4) RETURNING *'

    try {
        // Check if user with email and provider = manual exists
        const existingUser = await pool.query(existingUserQuery, [email, 'manual']);

        console.log(existingUser)
        console.log(existingUser.rows)
        console.log(existingUser.rows.length)

        if (existingUser.rows.length > 0) {
            console.log('Returning...')
            return res.json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = await pool.query(insertUserQuery, ['manual', email, name, hashedPassword]);
        return res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Internal server error' });   
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const checkExistingUserQuery = 'SELECT * FROM public.users WHERE email = $1 and provider = $2'

    try {
        // Check if user with email and provider = manual exists
        const existingUser = await pool.query(checkExistingUserQuery, [email, 'manual']);

        console.log(existingUser.rows)
        
        if (existingUser.rows.length === 0) {
            return res.json({ error: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, existingUser.rows[0].password);
        if (!isPasswordValid) {
            return res.json({ error: 'Invalid password' });
        }

        console.log('here')

        // Update login date
        const updateQuery = 'UPDATE public.users SET updated_at = NOW() WHERE email = $1 and provider = $2 RETURNING *';
        await pool.query(updateQuery, [email, 'manual']);

        const userResponse = await pool.query(checkExistingUserQuery, [email, 'manual']);

        // Generate JWT token
        const token = jwt.sign({
            userId: existingUser.rows[0].id,
            email: existingUser.rows[0].email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.json(userResponse.rows[0]);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;