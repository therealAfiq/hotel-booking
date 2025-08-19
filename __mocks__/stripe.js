// __mocks__/stripe.js
module.exports = function Stripe() {
  return {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ id: 'sess_123', url: 'http://mock.stripe/checkout' }),
      },
    },
    webhooks: {
      constructEvent: jest.fn().mockImplementation((payload, sig, secret) => {
        return JSON.parse(payload); // pretend it’s valid
      }),
    },
  };
};
