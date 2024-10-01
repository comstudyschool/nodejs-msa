# 8장: 마이크로서비스 간 인터페이스 통일 및 HTTP 게이트웨이 구축

# **1. 인터페이스 통일**

각 마이크로서비스가 서로 통신할 때 일관된 방법으로 데이터를 주고받도록 규칙을 정하는 것입니다. 이를 통해 서비스 간에 원활하고 오류 없는 통신이 가능해집니다.

### **왜 게이트웨이가 필요한가?**

여러 마이크로서비스가 각각 독립적으로 개발되다 보면 서로 통신하는 방식이 다를 수 있습니다. 인터페이스를 통일하면 서로 간의 데이터 형식, API 호출 방식 등이 표준화되어 통신이 더욱 효율적이고 오류를 줄일 수 있습니다.

# **2. HTTP 게이트웨이 구축**

게이트웨이는 모든 요청을 받아 적절한 마이크로서비스로 전달하는 중간 다리 역할을 합니다. 클라이언트는 여러 마이크로서비스에 직접 연결하지 않고, 게이트웨이를 통해 하나의 진입점만으로 모든 서비스에 접근할 수 있습니다.

### **장점**:

- **통합된 진입점**: 클라이언트는 하나의 URL(게이트웨이)을 통해 모든 서비스에 접근할 수 있습니다.
- **보안**: 게이트웨이를 통해 각 서비스에 접근하기 때문에 보안 정책을 한 곳에서 관리할 수 있습니다.
- **로드 밸런싱**: 게이트웨이가 트래픽을 여러 서비스로 나누어주기 때문에 시스템의 부하를 분산할 수 있습니다.

# **3. HTTP 게이트웨이 구축하기**

- 먼저 상품, 회원, 구매 관리 서비스를 각각 포트만 다르게 각각 구동 시킵니다.

## products.js 변경

- http://localhost:3001
- 모든 path에서 /products를 제거 합니다.

```jsx
// 상품 관리 서비스 (products.js)
const express = require('express');
const app = express();
app.use(express.json());

let products = [{method:"GET", path:"/products"}]; // 상품 데이터 저장

// 상품 추가
app.post('/', (req, res) => {
  const product = req.body;
  product.id = products.length + 1; // 상품 ID 생성
  products.push(product);
  res.status(201).json(product);
});

// 모든 상품 조회
app.get('/', (req, res) => {
  res.json(products);
});

// 특정 상품 수정
app.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === productId);

  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    res.json(products[index]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// 상품 삭제
app.delete('/:id', (req, res) => {
  products = products.filter(p => p.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = app;
```

## users.js 변경

- http://localhost:3002
- 모든 path에서 /users를 제거 합니다.

```jsx
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
```

## orders.js 변경

- http://localhost:3003
- 모든 path에서 /orders를 제거 합니다.

```jsx
// 구매 관리 서비스 (orders.js)
const express = require('express');
const axios = require('axios'); // 다른 서비스와 통신하기 위해 사용
const app = express();
app.use(express.json());

let orders = [{method:"GET", path:"/orders"}]; // 주문 데이터 저장

// 상품 구매 (회원 ID와 상품 ID를 이용해 주문 생성)
app.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // 회원 정보 확인 (회원 관리 서비스 호출)
    const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
    const user = userResponse.data;

    // 상품 정보 확인 (상품 관리 서비스 호출)
    const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
    const product = productResponse.data;

    // 주문 생성
    const order = {
      id: orders.length + 1,
      userId,
      productId,
      productName: product.name,
      quantity,
      total: product.price * quantity,
      date: new Date(),
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: '회원 또는 상품 정보를 확인할 수 없습니다.' });
  }
});
app.get('/', (req, res)=>{
  res.send(orders);
});

module.exports = app;
```

## gateway.js

- **Express를 이용해 간단한 게이트웨이 구현.**
- 대신 상품, 회원, 구매 관리 서비스를 통합하는 게이트웨이 구축.
- http://localhost:3000

```jsx
// gateway.js
const express = require('express');
const axios = require('axios'); // HTTP 요청을 보내기 위해 사용
const app = express();

app.use(express.json());

// 상품 관리 서비스로 요청 전달
app.use('/products', async (req, res) => {
  try {
    const response = await axios({
      method: req.method, 
      // GET, POST, PUT, DELETE 등 클라이언트 요청 방식을 그대로 사용
      url: `http://localhost:3001${req.originalUrl.replace('/products', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.message);
  }
});

// 회원 관리 서비스로 요청 전달
app.use('/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3002${req.originalUrl.replace('/users', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.message);
  }
});

// 구매 관리 서비스로 요청 전달
app.use('/orders', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3003${req.originalUrl.replace('/orders', '')}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.message);
  }
});

// 게이트웨이 서버 실행
app.listen(3000, () => {
  console.log('API Gateway is running on <http://localhost:3000>');
});

```

### **### 게이트웨이의 동작 방식**

- 클라이언트가 `http://localhost:3000/products`로 요청을 보내면, 게이트웨이가 이를 받아 `http://localhost:3001`로 전달합니다.
- 마찬가지로, 회원 관련 요청은 `http://localhost:3002`로, 구매 관련 요청은 `http://localhost:3003`로 전달됩니다.

### **사용 방법**

- 클라이언트는 각각의 마이크로서비스에 직접 접근하지 않고, 게이트웨이(`http://localhost:3000`)를 통해 모든 요청을 처리합니다.
    - 예를 들어, 상품 목록을 조회하려면 `GET http://localhost:3000/products`로 요청을 보내면 됩니다.
    - 회원 가입을 하려면 `POST http://localhost:3000/users`로 요청을 보내게 됩니다.
    - 회원 가입을 하려면 `POST http://localhost:3000/users`로 요청을 보내게 됩니다.

## server.js

- 상품, 회원, 구매 기능과 게이트웨이를 각각 포트로 한꺼번에 실행 되도록 내용을 수정 합니다.

```jsx
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
```

### **장점 요약**

- **중앙 관리**: 모든 요청을 게이트웨이로 통합하여 관리할 수 있습니다.
- **보안 및 인증**: 게이트웨이에서 인증 및 권한 관리를 수행할 수 있어 각 마이크로서비스의 보안이 강화됩니다.
- **유연성**: 서비스의 위치나 URL이 변경되어도 게이트웨이 설정만 변경하면 됩니다.

이렇게 게이트웨이를 구축하면 클라이언트는 각 서비스의 세부 내용을 알 필요 없이 하나의 진입점으로 모든 서비스를 이용할 수 있어 더욱 효율적이고 관리하기 쉬워집니다.