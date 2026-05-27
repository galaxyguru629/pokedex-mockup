const express = require('express');
const cors = require('cors');
const { jsonGraphqlExpress } = require('json-graphql-server/node');
const data = require('./mock/db');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.use(cors());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', jsonGraphqlExpress(data));

app.listen(PORT, HOST, () => {
  console.log(`GraphQL server running at http://${HOST}:${PORT}/`);
});
