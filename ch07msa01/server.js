// server.js

const express = require('express');
const http = require('http');

const msa1 = require('./products');
const msa2 = require('./users');
const msa3 = require('./orders');

// 메인 애플리케이션을 만듭니다.
const mainApp = express();
mainApp.use('/msa1', msa1);
mainApp.use('/msa2', msa2); 
mainApp.use('/msa3', msa3);

// HTTP 서버 생성
const server = http.createServer(mainApp);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});