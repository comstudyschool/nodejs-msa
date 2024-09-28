// controllers/productController.js
const Product = require('../models/productModel');

// 모든 상품 조회
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: '상품을 조회하는 중 오류가 발생했습니다.', error });
  }
};

// 특정 상품 조회
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '상품을 조회하는 중 오류가 발생했습니다.', error });
  }
};

// 새 상품 추가
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = await Product.create({ name, price, description });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: '상품을 추가하는 중 오류가 발생했습니다.', error });
  }
};

// 상품 정보 수정
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const updatedProduct = await Product.update(id, { name, price, description });
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '상품을 수정하는 중 오류가 발생했습니다.', error });
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.delete(id);
    if (deleted) {
      res.status(200).json({ message: '상품이 삭제되었습니다.' });
    } else {
      res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '상품을 삭제하는 중 오류가 발생했습니다.', error });
  }
};
