// gateway_ex.js
const express = require('express');
const http = require('http');

// 외부에 만들어진 애플리케이션 모듈 불러오기
const products = require('./product_service/app');
const users = require('./user_service/app');
const orders = require('./order_service/app');

// 메인 애플리케이션을 만듭니다.
const mainApp = express();
mainApp.use('/products', products);
mainApp.use('/users', users);
mainApp.use('/orders', orders);

// HTTP 서버 생성
const server = http.createServer(mainApp);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});