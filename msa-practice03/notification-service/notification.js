// notification-service/notification.js
const amqp = require('amqplib');
const metricsApp = require('./prometheus-metrics'); // Prometheus 메트릭 서버
const client = require('prom-client');

// RabbitMQ 연결 설정
async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertQueue('order_queue', { durable: false });
  return channel;
}

// 주문 메시지 수신 및 처리
async function receiveOrder() {
  const channel = await connectRabbitMQ();
  console.log(' [*] Waiting for messages in order_queue.');

  // 주문 메시지 수신
  channel.consume('order_queue', (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log(' [x] Received order:', order);

    // 주문 정보 처리 (예: 알림 생성)
    console.log(`Notification: New order received for ${order.product} by ${order.user}`);

    // 메트릭 업데이트
    orderCounter.inc();
  }, { noAck: true });
}

// Prometheus 메트릭 설정
const orderCounter = new client.Counter({
  name: 'notification_service_order_count',
  help: 'Total number of orders received by the notification service',
});

// 메트릭 서버는 별도의 포트에서 실행
metricsApp.listen(9101, () => {
  console.log('Notification Service metrics available on port 9101');
});

// 주문 수신 시작
receiveOrder();
