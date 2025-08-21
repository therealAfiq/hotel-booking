// scripts/generate-openapi.js
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '../src/docs/swagger.json');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Hotel Booking API',
    version: '1.0.0',
    description: 'REST API for hotel booking with authentication, payments, and role-based access control.',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  // Use a non-localhost server to avoid Redocly localhost/example.com warnings.
  servers: [
    {
      url: 'https://api.yourdomain.com/api/v1',
      description: 'Production (replace with your real host)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '64a1f...' },
          name: { type: 'string', example: 'Alice' },
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          role: { type: 'string', example: 'user' }
        }
      },
      AuthTokens: {
        type: 'object',
        properties: {
          tokens: {
            type: 'object',
            properties: {
              access: { type: 'string' },
              refresh: { type: 'string' }
            }
          },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      Room: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          capacity: { type: 'integer' },
          description: { type: 'string' }
        }
      },
      RoomCreate: {
        type: 'object',
        required: ['name', 'price', 'capacity'],
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
          capacity: { type: 'integer' },
          description: { type: 'string' }
        }
      },
      Booking: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
          room: { $ref: '#/components/schemas/Room' },
          checkIn: { type: 'string', format: 'date' },
          checkOut: { type: 'string', format: 'date' },
          totalPrice: { type: 'number' },
          status: { type: 'string', example: 'pending' }
        }
      },
      CreateBooking: {
        type: 'object',
        required: ['roomId', 'checkIn', 'checkOut'],
        properties: {
          roomId: { type: 'string' },
          checkIn: { type: 'string', format: 'date' },
          checkOut: { type: 'string', format: 'date' }
        }
      },
      CheckoutSessionResponse: {
        type: 'object',
        properties: {
          url: { type: 'string' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } }
        },
        responses: {
          '201': { description: 'User registered' },
          '400': { description: 'Invalid input' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
        },
        responses: {
          '200': {
            description: 'Login success',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } }
          },
          '400': { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } }
              }
            }
          }
        },
        responses: {
          '200': { description: 'New access token', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
          '401': { description: 'Invalid refresh token' }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (invalidate refresh token / clear cookie)',
        responses: {
          '200': { description: 'Logged out' }
        }
      }
    },

    '/rooms': {
      get: {
        tags: ['Rooms'],
        summary: 'List rooms (supports pagination & filtering)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } }
        ],
        responses: {
          '200': { description: 'Array of rooms', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Room' } } } } }
        }
      },
      post: {
        tags: ['Rooms'],
        summary: 'Create room (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RoomCreate' } } } },
        responses: {
          '201': { description: 'Room created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Room' } } } },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' }
        }
      }
    },
    '/rooms/{id}': {
      get: {
        tags: ['Rooms'],
        summary: 'Get a room by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Room', content: { 'application/json': { schema: { $ref: '#/components/schemas/Room' } } } }, '404': { description: 'Not found' } }
      },
      put: {
        tags: ['Rooms'],
        summary: 'Update room (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RoomCreate' } } } },
        responses: { '200': { description: 'Updated' }, '401': { description: 'Unauthorized' }, '403': { description: 'Forbidden' } }
      },
      delete: {
        tags: ['Rooms'],
        summary: 'Delete room (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Deleted' }, '401': { description: 'Unauthorized' }, '403': { description: 'Forbidden' } }
      }
    },

    '/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List bookings (user sees their own; admin sees all)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'user', in: 'query', schema: { type: 'string' }, description: '(admin-only) filter by user id' }
        ],
        responses: { '200': { description: 'Array of bookings', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Booking' } } } } } }
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create a booking (authenticated user)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBooking' } } } },
        responses: { '201': { description: 'Booking created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } }, '401': { description: 'Unauthorized' } }
      }
    },
    '/bookings/{id}': {
      get: {
        tags: ['Bookings'],
        summary: 'Get booking by id (ownership enforced)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Booking', content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } }, '403': { description: 'Forbidden' }, '404': { description: 'Not found' } }
      },
      delete: {
        tags: ['Bookings'],
        summary: 'Delete booking (user who owns booking or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Deleted' }, '401': { description: 'Unauthorized' }, '403': { description: 'Forbidden' } }
      }
    },

    '/payments/create-checkout-session': {
      post: {
        tags: ['Payments'],
        summary: 'Create a Stripe checkout session for a booking',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['bookingId'], properties: { bookingId: { type: 'string' } } } } } },
        responses: { '200': { description: 'Checkout session created', content: { 'application/json': { schema: { $ref: '#/components/schemas/CheckoutSessionResponse' } } } }, '401': { description: 'Unauthorized' } }
      }
    },

    '/payments/webhook': {
      post: {
        tags: ['Payments'],
        summary: 'Stripe webhook endpoint',
        requestBody: { required: false, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'Handled' }, '400': { description: 'Bad request' } }
      }
    }
  } // end paths
};

try {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
  console.log(`✅ OpenAPI spec written to ${outputPath}`);
} catch (err) {
  console.error('Failed to write swagger.json', err);
  process.exit(1);
}
