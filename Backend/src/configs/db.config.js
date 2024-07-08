const { Pool } = require('pg');

const db = new Pool({
    host: '34.101.173.6',
    user: 'edynoer',
    database: 'DOA_GMF',
    password: '12345',
    port: 5432
});

db.connect((err) => {
    if (err) {
        console.log(err);
        }
        else {
            console.log('Connected to the database');
        }
});

module.exports = db;