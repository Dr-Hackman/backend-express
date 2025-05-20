const { db } = require('./config');
const mysql = require('mysql2/promise');

const dbConfig = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    waitForConnections: db.waitForConnections,
    connectionLimit: db.connectionLimit,
});

module.exports = dbConfig;