// server.js

const express = require('express');
const http = require('http');

const products = require('./products');
const users = require('./users');
const orders = require('./orders');

// 메인 애플리케이션을 만듭니다.
const mainApp = express();
mainApp.use('/products', products);
mainApp.use('/users', users);
mainApp.use('/orders', orders);

// HTTP 서버 생성
const server = http.createServer(mainApp);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});