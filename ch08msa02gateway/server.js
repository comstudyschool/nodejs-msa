// server.js
const products = require('./products');
const users = require('./users');
const orders = require('./orders');
const gateway = require('./gateway');

products.listen(3001, () => {
  console.log('products Server is running on http://localhost:3001');
});

users.listen(3002, () => {
  console.log('users Server is running on http://localhost:3002');
});

orders.listen(3003, () => {
  console.log('orders Server is running on http://localhost:3003');
});

// 게이트웨이 서버 실행
gateway.listen(3000, () => {
	console.log('API Gateway is running on http://localhost:3000');
});