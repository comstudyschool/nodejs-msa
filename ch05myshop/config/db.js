// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'comstudy',        // 생성한 사용자 이름
  password: '1234',        // 사용자 비밀번호
  database: 'ch04',        // 사용하려는 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;