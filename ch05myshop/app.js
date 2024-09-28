const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('port', 3000);

// 라우터 연결
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

module.exports = app;