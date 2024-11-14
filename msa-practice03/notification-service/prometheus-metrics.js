// notification-service/prometheus-metrics.js
const client = require('prom-client');
const express = require('express');
const app = express();

// Prometheus 메트릭 설정
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
