const express = require('express');
const mysql = require('mysql2');
const axios = require('axios'); // 다른 서비스와 통신하기 위해 사용
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

let orders = []; // 주문 데이터 저장 배열

// 주문 생성 엔드포인트
app.post('/orders', async (req, res) => {
  const { productId, quantity, userId } = req.body;

  try {
    // 상품 관리 서비스에서 상품 정보 가져오기
    const productResponse = await axios.get(`${process.env.PRODUCTS_API_URL}/products/${productId}`);
    const product = productResponse.data;

    const order = {
      id: orders.length + 1,
      userId,
      productId,
      productName: product.name,
      quantity,
      total: product.price * quantity,
      date: new Date(),
    };

    // MySQL에 주문 저장
    const query = 'INSERT INTO orders (userId, productId, productName, quantity, total, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [order.userId, order.productId, order.productName, order.quantity, order.total, order.date], (err, result) => {
      if (err) {
        console.error('주문 저장 실패:', err);
        return res.status(500).json({ error: '주문 저장 실패' });
      }

      orders.push(order); // 주문 목록에 주문 추가
      res.status(201).json(order); // 생성된 주문 정보 반환
    });
  } catch (error) {
    console.error('상품 정보를 가져오는 데 실패했습니다.', error);
    res.status(400).json({ error: '상품 정보를 가져오는 데 실패했습니다.' });
  }
});

// 모든 주문 조회 API
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      console.error('주문 조회 실패:', err);
      return res.status(500).json({ error: '주문 조회 실패' });
    }
    res.json(results);
  });
});

// 서비스 포트 설정
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`);
});
