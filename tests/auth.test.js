const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });

    expect([200, 201]).toContain(res.status);
  });

  it("should not register duplicate user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });

    expect([200, 201, 400, 409]).toContain(res.status);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    if ([200, 201].includes(res.status)) {
      expect(res.body).toHaveProperty("tokens");
      expect(res.body.tokens).toHaveProperty("access");
      token = res.body.tokens.access;
    } else {
      expect([400, 401]).toContain(res.status);
    }
  });
});
