// 구매 관리 서비스 (orders.js)
const express = require('express');
const axios = require('axios'); // 다른 서비스와 통신하기 위해 사용
const app = express();
app.use(express.json());

let orders = [{method:"GET", path:"/orders"}]; // 주문 데이터 저장

// 상품 구매 (회원 ID와 상품 ID를 이용해 주문 생성)
app.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // 회원 정보 확인 (회원 관리 서비스 호출)
    const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
    const user = userResponse.data;

    // 상품 정보 확인 (상품 관리 서비스 호출)
    const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
    const product = productResponse.data;

    // 주문 생성
    const order = {
      id: orders.length + 1,
      userId,
      productId,
      productName: product.name,
      quantity,
      total: product.price * quantity,
      date: new Date(),
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: '회원 또는 상품 정보를 확인할 수 없습니다.' });
  }
});
app.get('/', (req, res)=>{
  res.send(orders);
});

module.exports = app;