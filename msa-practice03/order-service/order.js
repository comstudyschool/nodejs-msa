// order-service/order.js
const express = require('express');
const amqp = require('amqplib');
const metricsApp = require('./prometheus-metrics'); // Prometheus 메트릭 서버
const client = require('prom-client');
const app = express();

app.use(express.json());

// RabbitMQ 연결 설정
async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertQueue('order_queue', { durable: false });
  return channel;
}

// 주문 생성 시 이벤트 발행
app.post('/order', async (req, res) => {
  const { user, product, quantity } = req.body;

  const order = {
    user,
    product,
    quantity,
    date: new Date(),
  };

  // RabbitMQ에 연결하여 주문 이벤트 발행
  const channel = await connectRabbitMQ();
  channel.sendToQueue('order_queue', Buffer.from(JSON.stringify(order)));

  console.log('Order placed:', order);
  res.status(201).json({ message: 'Order placed successfully', order });

  // 메트릭 업데이트
  orderCounter.inc();
});

// Prometheus 메트릭 설정
const orderCounter = new client.Counter({
  name: 'order_service_order_count',
  help: 'Total number of orders received by the order service',
});

// 메트릭 서버는 별도의 포트에서 실행
metricsApp.listen(9100, () => {
  console.log('Order Service metrics available on port 9100');
});

// 주문 서비스 서버 시작
app.listen(3001, () => {
  console.log('Order Service is running on port 3001');
});
