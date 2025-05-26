const { Pool } = require('pg');
const creds = require('../secrets/dbCreds');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: { rejectUnauthorized: false },
    lookup: (hostname, options, callback) => {
        return lookup(hostname, { family: 4 }, callback); // Force IPv4
      },
});

module.exports = pool;