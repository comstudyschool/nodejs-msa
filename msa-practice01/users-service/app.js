const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// MySQL 데이터베이스 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 데이터베이스 연결 확인
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    process.exit(1);
  } else {
    console.log('MySQL에 성공적으로 연결되었습니다.');
  }
});

// 모든 사용자 조회 API
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('사용자 조회 실패:', err);
      return res.status(500).json({ error: '사용자 조회 실패' });
    }
    res.json(results);
  });
});

// 사용자 추가 API
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, result) => {
    if (err) {
      console.error('사용자 추가 실패:', err);
      return res.status(500).json({ error: '사용자 추가 실패' });
    }
    res.status(201).json({ message: '사용자가 추가되었습니다.', userId: result.insertId });
  });
});

// 서비스 포트 설정
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Users service is running on port ${PORT}`);
});
