const net = require('net');

// TCP 클라이언트 생성 및 서버 연결
const client = net.createConnection({ port: 4000 }, () => {
  console.log('Connected to server');
  client.write('Hello from client!');
});

// 서버로부터 메시지 수신
client.on('data', (data) => {
  console.log('Received from server:', data.toString());
  client.end(); // 연결 종료
});

// 연결 종료 시
client.on('end', () => {
  console.log('Disconnected from server');
});
