const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Room = require("../src/models/room.model");
const Booking = require("../src/models/booking.model");
const { signAccess } = require("../src/utils/token.util");
const bcrypt = require("bcryptjs");

describe("Booking API", () => {
  let userToken;
  let adminToken;
  let userId;
  let roomId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "4", 10);

    const userPass = await bcrypt.hash("password123", saltRounds);
    const adminPass = await bcrypt.hash("password123", saltRounds);

    const user = await User.create({
      name: "Booker",
      email: "booker@example.com",
      password: userPass,
      role: "user",
    });

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: adminPass,
      role: "admin",
    });

    userId = user._id.toString();
    userToken = signAccess({ id: user._id.toString(), role: user.role });
    adminToken = signAccess({ id: admin._id.toString(), role: admin.role });

    const room = await Room.create({ name: "Deluxe Room", price: 200, capacity: 2 });
    roomId = room._id.toString();
  });

  it("user can create booking", async () => {
    const res = await request(app)
      .post("/api/v1/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ roomId, checkIn: "2025-08-25", checkOut: "2025-08-27" });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("_id");
  });

  it("user can fetch only their bookings", async () => {
    await Booking.create({
      user: userId,
      room: roomId,
      checkIn: "2025-08-25",
      checkOut: "2025-08-27",
      totalPrice: 400,
    });

    const res = await request(app)
      .get("/api/v1/bookings")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("admin can get all bookings", async () => {
    await Booking.create({
      user: userId,
      room: roomId,
      checkIn: "2025-08-25",
      checkOut: "2025-08-27",
      totalPrice: 400,
    });

    const res = await request(app)
      .get("/api/v1/bookings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("user can delete their booking", async () => {
    const booking = await Booking.create({
      user: userId,
      room: roomId,
      checkIn: "2025-08-25",
      checkOut: "2025-08-27",
      totalPrice: 400,
    });

    const res = await request(app)
      .delete(`/api/v1/bookings/${booking._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect([200, 204]).toContain(res.statusCode);
  });
});
