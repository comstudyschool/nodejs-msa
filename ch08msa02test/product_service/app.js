// 상품 관리 서비스 (/product_service/app.js)
const express = require('express');
const app = express();
app.use(express.json());

let products = [
  {id:1, title:'Sonata', price:2000}
]; // 상품 데이터 저장

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