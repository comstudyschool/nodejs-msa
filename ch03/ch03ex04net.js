const net = require('net');

// TCP 서버 생성
const server = net.createServer((socket) => {
  console.log('Client connected');

  // 클라이언트로부터 메시지 수신
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Hello from server!');
  });

  // 클라이언트 연결 종료 시
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

// 4000번 포트에서 TCP 서버 실행
server.listen(4000, () => {
  console.log('TCP server running on port 4000');
});