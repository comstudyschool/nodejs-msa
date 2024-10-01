// 회원 관리 서비스 (users.js)
const express = require('express');
const app = express();
app.use(express.json());

let users = [{method:"GET", path:"/users"}]; // 회원 데이터 저장

// 회원 가입
app.post('/', (req, res) => {
  const user = req.body;
  user.id = users.length + 1; // 회원 ID 생성
  users.push(user);
  res.status(201).json(user);
});

// 모든 회원 조회
app.get('/', (req, res) => {
  res.json(users);
});

// 회원 로그인 (간단한 이메일/비밀번호 확인)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

module.exports = app;