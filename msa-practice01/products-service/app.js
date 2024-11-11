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

// 상품 조회 API
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('상품 조회 실패:', err);
      return res.status(500).json({ error: '상품 조회 실패' });
    }
    res.json(results);
  });
});

// 상품 추가 API
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
  db.query(query, [name, price], (err, result) => {
    if (err) {
      console.error('상품 추가 실패:', err);
      return res.status(500).json({ error: '상품 추가 실패' });
    }
    res.status(201).json({ message: '상품이 추가되었습니다.', productId: result.insertId });
  });
});

// 서비스 포트 설정
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Products service is running on port ${PORT}`);
});
