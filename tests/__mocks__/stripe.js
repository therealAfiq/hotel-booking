// tests/__mocks__/stripe.js
// A very small Stripe stub suitable for unit tests
module.exports = function Stripe() {
  return {
    checkout: {
      sessions: {
        create: jest.fn(async (opts) => {
          // return minimal session object with url + id
          return {
            id: 'cs_test_session_123',
            url: 'https://checkout.stripe.test/session/cs_test_session_123',
            ...opts,
          };
        }),
      },
    },
    webhooks: {
      // In tests we will send the raw body as JSON; just parse and return it as event
      constructEvent: jest.fn((rawBody /* Buffer or string */, signature, secret) => {
        // rawBody may be Buffer or string
        const payload = typeof rawBody === 'string' ? rawBody : rawBody.toString();
        return JSON.parse(payload);
      }),
    },
  };
};
