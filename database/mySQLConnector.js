// Load module
const mysql = require('mysql')
const config = require('../config/database.json')[process.env.NODE_ENV]

// Initialize pool
const pool = mysql.createPool({
  connectionLimit: 1000,
  host: config.host,
  user: config.user,
  port: config.port,
  database: config.database,
  debug: false
})
module.exports = pool
