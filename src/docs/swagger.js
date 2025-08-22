// src/docs/swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
},
    info: {
      title: 'Hotel Booking API',
      version: '1.0.0',
      description: 'API documentation for the Hotel Booking system',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 📌 scans route files for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  // Swagger UI
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Raw JSON
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
