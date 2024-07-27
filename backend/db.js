const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'parkease',
    password: 'rusiru1wi',
    port: 5432,
});

module.exports = pool;
