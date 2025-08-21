// src/docs/swagger.js
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const specPath = path.join(__dirname, 'swagger.json');

function swaggerDocs(app) {
  let swaggerSpec = {
    openapi: '3.0.0',
    info: { title: 'API docs not generated yet', version: '0.0.0' },
    paths: {}
  };

  if (fs.existsSync(specPath)) {
    try {
      swaggerSpec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    } catch (e) {
      console.warn('Could not read src/docs/swagger.json — serving minimal docs instead.', e);
    }
  } else {
    console.warn('src/docs/swagger.json not found. Run "npm run openapi:gen" to generate it.');
  }

  // Serve swagger UI at /api/v1/docs
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Raw JSON (helpful for scripts / lint)
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(swaggerSpec));
  });
}

module.exports = swaggerDocs;
