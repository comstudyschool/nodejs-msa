// /orders/orders.js
const express = require('express');
const axios = require('axios');
const config = require('./config'); // 환경 변수 설정 가져오기

const app = express();
app.use(express.json());

// 주문 데이터 저장
let orders = [
    {
      id: 1,
      userId: "hong",
      productId: 1,
      productName: 'Sonata',
      quantity : 1,
      total: 2000,
      date: new Date(),
    }
]; 

app.get('/', (req, res) => {
    res.send(orders);
})

// 주문 생성 엔드포인트
app.post('/', async (req, res) => {
  const { productId, quantity, userId } = req.body;

  try {
    // 상품 관리 서비스에서 상품 정보 가져오기
    const productResponse = await axios.get(`${config.PRODUCTS_API_URL}/products/${productId}`);
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

    orders.push(order); // 주문 목록에 주문 추가
    res.status(201).json(order); // 생성된 주문 정보 반환
  } catch (error) {
    console.error('상품 정보를 가져오는 데 실패했습니다.', error);
    res.status(400).json({ error: '상품 정보를 가져오는 데 실패했습니다.' });
  }
});

module.exports = app;
