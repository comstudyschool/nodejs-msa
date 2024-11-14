// gateway/prometheus-metrics.js
const client = require('prom-client');
const express = require('express');
const app = express();

// 기본 메트릭 수집 설정
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// /metrics 엔드포인트에서 메트릭 제공
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
