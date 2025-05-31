// backend/routes/products.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

const Joi = require('joi');

const pool = require('../config/db.js');

// Used in validating the types of data provided from user
const showSchema = Joi.object({
    show_id: Joi.string().uuid().required(),
    title: Joi.string().allow(null, '').optional(),
    critics_score: Joi.number().integer().min(0).max(100).allow(null).optional(),
    audience_score: Joi.number().integer().min(0).max(100).allow(null).optional(),
    image_url: Joi.string().uri().allow(null, '').optional(),
    media_url: Joi.string().allow(null, '').optional(),
    release_date: Joi.string().allow(null, '').optional(),
    is_video: Joi.boolean().allow(null).optional()
});

// Joi schema for optional updates
const updateShowSchema = Joi.object({
    title: Joi.string().optional(),
    critics_score: Joi.number().integer().min(0).max(100).allow(null).optional(),
    audience_score: Joi.number().integer().min(0).max(100).allow(null).optional(),
    image_url: Joi.string().uri().optional(),
    media_url: Joi.string().optional(),
    release_date: Joi.string().optional(),
    is_video: Joi.boolean().optional()
}).min(1); // require at least one field to update

// getShows
router.get('/getShows', async (req, res) => {
    try {
        const response = await axios.get('https://rottentomato.p.rapidapi.com/streaming-tv', {
            headers: {
              'x-rapidapi-host': 'rottentomato.p.rapidapi.com',
              'x-rapidapi-key': process.env.RAPID_API_KEY
            }
        });

        if (response.status !== 200) {
            return res.status(response.status).json({ error: 'Failed to fetch shows from API' });
        }
        const shows = response.data.shows;

        const insertQuery = `
            INSERT INTO public.tv_shows (show_id, title, critics_score, audience_score, image_url, media_url, release_date, is_video)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `

        for (let show of shows) {
            if (!show.show_id) continue;
      
            await pool.query(insertQuery, [
              show.show_id,
              show.title || null,
              show.critics_score ? parseInt(show.critics_score) : null,
              show.audience_score ? parseInt(show.audience_score) : null,
              show.image_url || null,
              show.media_url || null,
              show.release_date || null,
              show.is_video !== undefined ? show.is_video : null,
            ]);
        }

        res.json({ message: 'Shows inserted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})


// CRUD OPERATIONS FOR publiv.tv_shows table
router.post('/createShow', async (req, res) => {
    const { error, value } = await showSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ error: 'Validation failed', details: error.details });
    }

    const {
        show_id,
        title,
        critics_score,
        audience_score,
        image_url,
        media_url,
        release_date,
        is_video
    } = value;

    const insertQuery = `
        INSERT INTO public.tv_shows (show_id, title, critics_score, audience_score, image_url, media_url, release_date, is_video)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    ` 

    try {
        const result = await pool.query(insertQuery, [
            show_id,
            title,
            critics_score,
            audience_score,
            image_url,
            media_url,
            release_date,
            is_video
        ]);

        res.status(201).json({ message: 'TV show created', show: result.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

router.put('/updateShow/:show_id', async (req, res) => {
    const { show_id } = req.params;

    if (!show_id) {
        return res.status(400).json({ error: 'Show ID is required' });
    }

    const { error, value: updates } = await updateShowSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ error: 'Validation failed', details: error.details });
    }

    // Construct update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update)' });
    }

    const clause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    
    const updateQuery = `UPDATE public.tv_shows SET ${clause} WHERE show_id = $${fields.length + 1} RETURNING *;`

    try {
        const result = await pool.query(updateQuery, [...values, show_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'TV show not found' });
        }

        res.json({ message: 'Show updated successfully', updated: result.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

router.get('/getShow/:show_id', async (req, res) => {
    const { show_id } = req.params;

    if (!show_id) {
        return res.status(400).json({ error: 'Show ID is required' });
    }

    const selectQuery = 'SELECT * FROM public.tv_shows WHERE show_id = $1';

    try {
        const result = await pool.query(selectQuery, [show_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }

        res.json({ show: result.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

router.get('/getAllShows', async (req, res) => {
    const selectQuery = 'SELECT * FROM public.tv_shows ORDER BY title ASC';

    try {
        const result = await pool.query(selectQuery);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

router.delete('/deleteShow/:show_id', async (req, res) => {
    const { show_id } = req.params;

    if (!show_id) {
        return res.status(400).json({ error: 'Show ID is required' });
    }

    const deleteQuery = 'DELETE FROM public.tv_shows WHERE show_id = $1 RETURNING *';

    try {
        const result = await pool.query(deleteQuery, [show_id]);   
        
        if (result.rows.length == 0) {
            return res.status(404).json({ error: 'Show not found' });
        }

        res.json({ message: 'Show deleted successfully', show: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

module.exports = router;
