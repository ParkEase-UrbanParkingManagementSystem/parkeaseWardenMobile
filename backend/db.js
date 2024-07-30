const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'parkease',
    password: '1245',
    port: 5432,
});

module.exports = pool;
