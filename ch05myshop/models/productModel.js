// models/productModel.js
const db = require('../config/db');

const Product = {
  // 모든 상품 조회
  findAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM Products');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // ID로 특정 상품 조회
  findById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM Products WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // 새 상품 추가
  create: async (product) => {
    const { name, price, description } = product;
    try {
      const [result] = await db.query(
        'INSERT INTO Products (name, price, description) VALUES (?, ?, ?)',
        [name, price, description]
      );
      return { id: result.insertId, ...product };
    } catch (error) {
      throw error;
    }
  },

  // 상품 정보 수정
  update: async (id, product) => {
    const { name, price, description } = product;
    try {
      const [result] = await db.query(
        'UPDATE Products SET name = ?, price = ?, description = ? WHERE id = ?',
        [name, price, description, id]
      );
      if (result.affectedRows === 0) return null; // 해당 ID의 상품이 없는 경우
      return { id, ...product };
    } catch (error) {
      throw error;
    }
  },

  // 상품 삭제
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM Products WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Product;
