// backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const googleRoutes = require('./routes/google');
const linkedinRoutes = require('./routes/linkedin');
const showsRoutes = require('./routes/shows');
const usersRoutes = require('./routes/users')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', googleRoutes)
app.use('/', linkedinRoutes)
app.use('/', showsRoutes)
app.use('/', usersRoutes)

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});