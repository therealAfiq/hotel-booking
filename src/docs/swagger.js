// src/docs/swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Booking API',
      version: '1.0.0',
      description: 'API documentation for the Hotel Booking system',
    },
    servers: [
  {
    url: "https://hotel-booking-f1ei.onrender.com/api/v1", // Render prod
  },
],


    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a8f7b2e4a7c9f123456789' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
          },
        },
        Room: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b8f7b2e4a7c9f987654321' },
            name: { type: 'string', example: 'Deluxe Room' },
            price: { type: 'number', example: 150 },
            capacity: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64c8f7b2e4a7c9f123456000' },
            userId: { type: 'string', example: '64a8f7b2e4a7c9f123456789' },
            roomId: { type: 'string', example: '64b8f7b2e4a7c9f987654321' },
            checkIn: { type: 'string', format: 'date', example: '2025-08-25' },
            checkOut: { type: 'string', format: 'date', example: '2025-08-28' },
            status: { type: 'string', enum: ['confirmed', 'cancelled'], example: 'confirmed' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64d8f7b2e4a7c9f123456999' },
            bookingId: { type: 'string', example: '64c8f7b2e4a7c9f123456000' },
            amount: { type: 'number', example: 450 },
            method: { type: 'string', enum: ['card', 'paypal', 'cash'], example: 'card' },
            status: { type: 'string', enum: ['pending', 'paid', 'failed'], example: 'paid' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-08-21T12:34:56.789Z' },
          },
        },
      },
    },
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
