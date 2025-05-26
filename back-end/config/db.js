const { Pool } = require('pg');
const creds = require('./db_creds');
const dns = require('dns');

// Force DNS to prefer IPv4
const pool = new Pool({
  host: creds.host,
  port: creds.port,
  database: creds.database,
  user: creds.user,
  password: creds.password,
  ssl: {
    rejectUnauthorized: false, // Required by Supabase
  },
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
});

module.exports = pool;