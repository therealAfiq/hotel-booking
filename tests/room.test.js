const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Room = require("../src/models/room.model");
const { signAccess } = require("../src/utils/token.util");
const bcrypt = require("bcryptjs");

describe("Room API", () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    await User.deleteMany({});
    await Room.deleteMany({});

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "4", 10);
    const adminPass = await bcrypt.hash("password123", saltRounds);
    const userPass = await bcrypt.hash("password123", saltRounds);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: adminPass,
      role: "admin",
    });

    const user = await User.create({
      name: "User",
      email: "user@example.com",
      password: userPass,
      role: "user",
    });

    adminToken = signAccess({ id: admin._id.toString(), role: admin.role });
    userToken = signAccess({ id: user._id.toString(), role: user.role });
  });

  it("admin can create room", async () => {
    const res = await request(app)
      .post("/api/v1/rooms")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Deluxe", price: 200, capacity: 2 });

    expect([200, 201]).toContain(res.statusCode);
    const rooms = await Room.find({});
    expect(rooms.length).toBeGreaterThanOrEqual(1);
  });

  it("user cannot create room", async () => {
    const res = await request(app)
      .post("/api/v1/rooms")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Suite", price: 400, capacity: 3 });

    expect([401, 403]).toContain(res.statusCode);
  });

  it("anyone can list rooms", async () => {
    await Room.create({ name: "R1", price: 100, capacity: 1 });
    const res = await request(app).get("/api/v1/rooms");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
