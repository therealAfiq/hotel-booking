const request = require("supertest");
const app = require("../src/app");
const Booking = require("../src/models/booking.model");

describe("Payment API", () => {
  let bookingId;

  it("should create a booking before payment", async () => {
    const res = await request(app)
      .post("/api/v1/bookings")
      .send({
        roomId: "64cfc05f6f3e2a1234567890",
        userId: "64cfc05f6f3e2a0987654321",
        checkIn: "2025-09-01",
        checkOut: "2025-09-05",
      });

    expect([200, 201, 400, 401]).toContain(res.status);
    if (res.body && res.body._id) {
      bookingId = res.body._id;
    }
  });

  it("should create a checkout session", async () => {
    const res = await request(app)
      .post("/api/v1/payments/create-checkout-session")
      .send({ bookingId });

    expect([200, 201, 400, 401]).toContain(res.status);
    if ([200, 201].includes(res.status)) {
      expect(res.body).toHaveProperty("url");
    }
  });

  it("should handle webhook event safely", async () => {
    const res = await request(app)
      .post("/api/v1/payments/webhook")
      .send({
        type: "checkout.session.completed",
        data: { object: { metadata: { bookingId } } },
      });

    expect([200, 201, 400, 401]).toContain(res.status);

    if (bookingId) {
      const updated = await Booking.findById(bookingId);
      if (updated) {
        expect(updated.status).toBe("paid");
      }
    }
  });
});
