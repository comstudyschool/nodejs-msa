// app.js (메인 서버 파일)
const express = require('express');
const config = require('./orders/config'); // 환경 설정 가져오기
const orders = require('./orders/orders');
const app = express();
const http = require('http');

app.use('/orders', orders);

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`>> 서버 실행 중 http://localhost:${config.port}`);
});
