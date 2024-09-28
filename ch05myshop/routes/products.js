// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 모든 상품 조회
router.get('/', productController.getAllProducts);

// 특정 상품 조회
router.get('/:id', productController.getProductById);

// 새 상품 추가
router.post('/', productController.createProduct);

// 상품 정보 수정
router.put('/:id', productController.updateProduct);

// 상품 삭제
router.delete('/:id', productController.deleteProduct);

module.exports = router;
