const http = require('http');

// 서버에 GET 요청 보내기
http.get('http://localhost:8888', (res) => {
  let data = '';

  // 응답 데이터 수신
  res.on('data', (chunk) => {
    data += chunk;
  });

  // 응답 완료 시
  res.on('end', () => {
    console.log('Response:', data);
  });
});
