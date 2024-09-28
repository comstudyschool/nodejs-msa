// Express를 사용한 간단한 REST API
const express = require('express');
const app = express();
app.use(express.json());

let products = [];

// 상품 조회
app.get('/products', (req, res) => {
  res.json(products);
});

// 상품 추가
app.post('/products', (req, res) => {
  const product = req.body;
  products.push(product);
  res.status(201).json(product);
});

// 상품 수정
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    products[productIndex] = req.body;
    res.json(products[productIndex]);
  } else {
    res.status(404).send('Product not found');
  }
});

// 상품 삭제
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT , () => {
  console.log(`Server running on http://localhost:${PORT}`);
});