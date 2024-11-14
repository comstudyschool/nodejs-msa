const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const client = require('prom-client');
const app = express();

// 마이크로서비스의 엔드포인트 설정
const services = {
  'order-service': 'http://order-service:3001',
  'notification-service': 'http://notification-service:3002',
};

// Prometheus 메트릭 설정
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// HTTP 요청 수를 카운트하는 커스텀 메트릭
const httpRequestCounter = new client.Counter({
  name: 'gateway_http_requests_total',
  help: 'Total number of HTTP requests received by the gateway',
  labelNames: ['method', 'service', 'status'],
});

// /metrics 엔드포인트에서 메트릭 제공
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// 각 서비스에 대해 프록시 미들웨어 생성 및 연결
Object.keys(services).forEach(serviceName => {
  const serviceURL = services[serviceName];

  app.use(
    `/${serviceName}`,
    createProxyMiddleware({
      target: serviceURL,
      changeOrigin: true,
      pathRewrite: {
        [`^/${serviceName}`]: '',
      },
      onProxyRes: (proxyRes, req, res) => {
        // 응답이 완료되면 메트릭 업데이트
        httpRequestCounter.labels(req.method, serviceName, proxyRes.statusCode).inc();
      },
    })
  );
});

// 게이트웨이 서버 시작
app.listen(3000, () => {
  console.log('API Gateway is running on port 3000');
});
