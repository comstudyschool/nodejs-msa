# 3장: Node.js의 비동기 프로그래밍, 싱글 스레드 프로그래밍 이해 및 HTTP/TCP 서버와 클라이언트 구현

# **1. 비동기 프로그래밍**

- 비동기 프로그래밍은 작업이 완료될 때까지 기다리지 않고 다른 작업을 동시에 처리하는 방식입니다.
- 비동기 프로그래밍이 중요한 이유는 Node.js 비동기 방식을 사용해 많은 작업을 빠르게 처리할 수 있기 때문입니다.

### **비동기 프로그래밍 예제:**

- 파일을 읽는 동안 다른 작업을 계속 진행할 수 있습니다.
- 다음 코드에서 `fs.readFile`은 비동기적으로 실행되어 파일을 읽는 동안 프로그램이 멈추지 않고 다음 줄을 실행합니다.

### ch03ex01.js

```jsx
const fs = require('fs');

// 파일 읽기 (비동기)
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('2. File content:', data);
});

console.log('1. This message appears before the file is read.');
```

### example.txt

```
Hello world
nodejs msa project
```

### 실행 결과

```bash
workspace-nodejs-msa\ch03>node ch03ex01.js
This message appears before the file is read.
File content: Hello world
nodejs msa project
```

# **2. 싱글 스레드 프로그래밍**

- **설명**: Node.js는 하나의 스레드로 모든 작업을 처리합니다. 일반적으로 여러 스레드를 사용하는 다른 언어와 다르게, Node.js는 비동기 방식으로 작업을 효율적으로 처리합니다.
- **장점**: 요청이 많아도 처리 속도가 빠르고, 많은 자원을 사용하지 않습니다.

# **3. HTTP 서버와 클라이언트 구현**

## **HTTP 서버 만들기**

- HTTP 서버는 웹 브라우저의 요청을 처리하고 응답을 보내는 역할을 합니다.

### ch03ex02.js

```jsx
const http = require('http');

const PORT = 8888;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end('<h1>안녕, 세계!</h1>');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### 터미널에서 서버 실행 결과

```bash
workspace-nodejs-msa\ch03>**node ch03ex02.js** 
Server running at http://localhost:8888/
```

### 브라우저 접속 테스트

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/73d32148-7b0b-42ac-9b0b-2bfaa5903e80/42809d1b-437d-4028-8a79-e62c9ffb5144/image.png)

## **HTTP 클라이언트 만들기**

- 서버에 요청을 보내고 응답을 받는 역할을 합니다.

### ch03ex03client.js

```jsx
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

```

- 이 코드는 `http.get`을 사용하여 웹 서버에 요청을 보내고 응답을 출력합니다.

### 터미널에서 클라이언트 실행 결과

- ch03ex02.js가 실행 된 상태에서 새 터미널을 열고 ch03ex03client.js를 실행 합니다.

```bash
workspace-nodejs-msa\ch03>**node ch03ex03client.js**
Response: <h1>Hello, World!</h1>
```

# **4. TCP 서버와 클라이언트 구현**

- **TCP 서버**: HTTP보다 더 낮은 수준의 네트워크 통신을 위한 서버를 만들 수 있습니다.

### ch03ex04net.js

```jsx
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

```

- TCP 서버는 클라이언트와 직접 통신하며, 데이터를 주고받을 수 있습니다.
- **TCP 클라이언트**: 서버에 연결하고 메시지를 보낼 수 있습니다.

### 새 터미널에서 TCP 서버 실행

```bash
workspace-nodejs-msa\ch03>**node ch03ex04net.js**
TCP server running on port 4000
```

### ch03ex04netClient.js

```jsx
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

```

- 클라이언트는 서버에 연결하고 데이터를 주고받을 수 있습니다.

### 새 터미널에서 TCP 클랑이언트 실행

```bash
workspace-nodejs-msa\ch03>**node ch03ex04netClient.js**
**Connected to server
Received from server: Hello from server!
Disconnected from server**
```

### TCP 서버에로 전달 된 메세지 확인

```bash
workspace-nodejs-msa\ch03>**node ch03ex04net.js**
TCP server running on port 4000
**Client connected
Received: Hello from client!
Client disconnected**
```

### 요약

- **비동기 프로그래밍**은 작업을 동시에 처리하고, **싱글 스레드 프로그래밍**은 하나의 스레드로 효율적으로 작업을 처리합니다.
- **HTTP/TCP 서버와 클라이언트 구현**을 통해 웹 요청과 네트워크 통신을 직접 다룰 수 있습니다.

# 노트

## **윈도우 터미널에서 특정 포트의 프로세스 확인 및 강제 종료**

한대의 컴퓨터에서 여러 프로세스가 같은 포트를 사용 할 수 없습니다. 포트 충돌이 날 경우 해당 포트를 사용하는 프로세스를 강제로 종료 한 후 새로 실행 할 수 있습니다.

### **1. 특정 포트를 사용하는 프로세스 확인**

**명령어:**

```bash
netstat -ano | findstr :포트번호

```

- `포트번호` 부분에 확인하려는 포트 번호를 입력합니다.
- 예: `netstat -ano | findstr :3000`

**출력 예시:**

```bash
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       1234
```

- 마지막에 표시된 숫자 `1234`는 해당 포트를 사용 중인 프로세스의 PID(Process ID)입니다.

### **2. 특정 포트를 사용하는 프로세스 강제 종료**

**명령어:**

```bash
taskkill /PID 프로세스ID /F

```

- `프로세스ID` 부분에 위에서 확인한 PID를 입력합니다.
- 예: `taskkill /PID 1234 /F`
- `/F` 옵션은 강제 종료를 의미합니다.

# 학습 정리

- Node.js의 핵심 특징인 **비동기 프로그래밍**과 **싱글 스레드 모델**을 이해하기 위해 이 장을 실습했습니다. 이러한 개념은 Node.js가 고성능, 비동기식 I/O 처리를 효율적으로 수행하는 이유를 파악하는 데 필수적입니다.
- **HTTP/TCP 서버와 클라이언트 구현**을 통해 Node.js의 비동기 방식이 어떻게 요청을 처리하고 응답하는지 실습합니다.
- 이 실습을 통해 Node.js가 싱글 스레드로도 다수의 클라이언트 요청을 처리할 수 있는 비동기 처리 능력을 직접 체험하고 이해하는 것이 목적입니다.