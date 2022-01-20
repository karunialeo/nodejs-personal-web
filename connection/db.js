// import postgreSQL
const { Pool } = require('pg')

// setup connection pool postgreSQL for nodeJS
const dbPool = new Pool({
    database: 'personal_web_karunialeo',
    port: 5432,
    user: 'postgres',
    password: 'gultomleo',
    idleTimeoutMillis: 0
})

module.exports = dbPool