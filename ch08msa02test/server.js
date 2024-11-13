// server.js
const products = require('./product_service/app');
const users = require('./user_service/app');
const orders = require('./order_service/app');
const gateway = require('./gateway/app');

// 혼자 해 보기
// 각각 서비스 실행을 각각 서비스 app.js에 옮겨서 실행 되도록 수정 해 주세요.

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