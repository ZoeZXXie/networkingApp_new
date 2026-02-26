const mysql = require('mysql2/promise')

const db = mysql.createPool({
  host: 'localhost',
  user: 'team4',
  password: 'password',
  database: 'dev640proj',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

console.log('MySQL Pool Connected')

module.exports = db