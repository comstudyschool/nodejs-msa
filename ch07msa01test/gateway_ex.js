// gateway_ex.js
const express = require('express');
const http = require('http');

const app1 = express();
const app2 = express();
const app3 = express();

// 각각의 애플리케이션에 라우트를 정의합니다.
app1.get('/', (req, res) => res.send('Hello from App 1'));
app2.get('/', (req, res) => res.send('Hello from App 2'));
app3.get('/', (req, res) => res.send('Hello from App 3'));

// 메인 애플리케이션을 만듭니다.
const mainApp = express();
mainApp.use('/app1', app1);
mainApp.use('/app2', app2);
mainApp.use('/app3', app3);

// HTTP 서버 생성
const server = http.createServer(mainApp);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});