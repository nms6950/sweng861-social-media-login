const { Pool } = require('pg');

const pool = new Pool({
  host: "aws-0-us-east-2.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.wiwxrxvoxotkwtootgkw",
  password: "nms6950",
});

module.exports = pool;