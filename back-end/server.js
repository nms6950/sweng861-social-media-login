// backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const googleRoutes = require('./routes/google');
const linkedinRoutes = require('./routes/linkedin');
const showsRoutes = require('./routes/shows');
const usersRoutes = require('./routes/users');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend from 'public' folder (where your workflow copies frontend build)
app.use(express.static(path.join(__dirname, 'public')));

// Backend routes
app.use('/', googleRoutes);
app.use('/', linkedinRoutes);
app.use('/', showsRoutes);
app.use('/', usersRoutes);

const PORT = 4000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;