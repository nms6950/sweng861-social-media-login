const { Pool } = require('pg');
const creds = require('../secrets/dbCreds');

const pool = new Pool({
    host: creds.host,
    port: creds.port,
    database: creds.database,
    user: creds.user,
    password: creds.password,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
});

module.exports = pool;