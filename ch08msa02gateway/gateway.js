// gateway.js
const express = require('express');
const axios = require('axios'); // HTTP 요청을 보내기 위해 사용
const app = express();

app.use(express.json());

// 상품 관리 서비스로 요청 전달
app.use('/products', async (req, res) => {
  try {
    const response = await axios({
      method: req.method, 
      // GET, POST, PUT, DELETE 등 클라이언트 요청 방식을 그대로 사용
      url: `http://localhost:3001${req.originalUrl.replace('/products', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.message);
  }
});

// 회원 관리 서비스로 요청 전달
app.use('/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3002${req.originalUrl.replace('/users', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.message);
  }
});

// 구매 관리 서비스로 요청 전달
app.use('/orders', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3003${req.originalUrl.replace('/orders', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.message);
  }
});

// 게이트웨이 서버 실행
// app.listen(3000, () => {
//   console.log('API Gateway is running on http://localhost:3000');
// });

module.exports = app;