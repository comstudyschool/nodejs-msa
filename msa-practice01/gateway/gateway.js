const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// 상품 서비스 라우팅
app.use('/products', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.PRODUCTS_SERVICE_URL}${req.originalUrl.replace('/products', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

// 사용자 서비스 라우팅
app.use('/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.USERS_SERVICE_URL}${req.originalUrl.replace('/users', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

// 주문 서비스 라우팅
app.use('/orders', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.ORDERS_SERVICE_URL}${req.originalUrl.replace('/orders', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

// 게이트웨이 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
