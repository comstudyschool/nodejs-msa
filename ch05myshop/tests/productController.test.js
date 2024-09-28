// productController.test.js
const request = require('supertest');
const app = require('../app');
const db = require('../config/db'); // 데이터베이스 연결 모듈 가져오기
let server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    done();
  });
});

afterAll(async () => {
  await server.close(); // 서버 연결 종료
  await db.end(); // 데이터베이스 연결 종료
});

describe('Product API', () => {
  it('GET /products - should return all products', async () => {
    const response = await request(server).get('/products');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('POST /products - should create a new product', async () => {
    const newProduct = { name: 'Test Product', price: 100, description: 'Test Description' };
    const response = await request(server).post('/products').send(newProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
  });
});
