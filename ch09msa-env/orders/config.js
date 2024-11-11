// orders/config.js (환경 설정을 불러오는 파일)
require('dotenv').config();

const config = {
  port: process.env.PORT || 3003,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  PRODUCTS_API_URL: process.env.PRODUCTS_API_URL,
};
module.exports = config;