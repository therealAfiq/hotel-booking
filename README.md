# 🏨 Hotel Booking Backend

A full-featured **Hotel Booking backend** built with Node.js, Express, MongoDB, JWT authentication, Stripe payments, and Docker.  
Supports role-based access (`user` and `admin`), CI/CD, and production deployment.

---

## ✨ Features

- **🔑 Authentication & Authorization**
  - JWT-based
  - Role-based access (`user` / `admin`)
- **📅 Bookings**
  - Users can create, read, delete bookings
  - Admin can view all bookings
- **🛏 Rooms**
  - Admin can CRUD hotel rooms
- **💳 Payments**
  - Stripe integration for checkout and webhook confirmation
- **🛠 Validation**
  - Request validation with Joi
- **🧪 Testing**
  - Jest & Supertest
  - In-memory MongoDB for isolated tests
- **📚 API Documentation**
  - Swagger UI: `/api/v1/docs`
- **🐳 Deployment**
  - Dockerized backend
  - Production-ready `.env.prod` configuration
- **⚡ CI/CD**
  - GitHub Actions workflow
  - Tests automatically run on push or pull request

---

## 🗂 Project Structure

```text
project2/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  └─ utils/
├─ tests/
├─ .env
├─ .env.test
├─ .env.prod
├─ Dockerfile
├─ package.json
└─ README.md

```

📝 Environment Variables

.env – local development

.env.test – test environment

.env.prod – production

Required Variables (example .env.prod):
```
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/hotel_booking
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
COOKIE_SECRET=your_cookie_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
BASE_URL=https://my-backend-url.com
CLIENT_URL=https://my-frontend-url.com
```
```
🚀 Getting Started
Local Development
# Install dependencies
npm install

# Run locally
npm run dev

Run Tests
# Run all tests
npm test

Docker
# Build Docker image
docker build -t hotel-booking-backend .

# Run container
docker run -p 3000:3000 hotel-booking-backend
```

⚙️ CI/CD

GitHub Actions runs tests on each push or pull request to main.

🌐 Deployment

Backend is production-ready and deployed.

Frontend can connect via BASE_URL.

Ensure .env.prod variables are correctly configured on the production host.

🔜 Next Steps

Develop frontend (React / Vue / Next.js)

Connect frontend to deployed backend

Optional improvements:

✉️ Email notifications

📊 Analytics endpoints

📈 Logging/monitoring

📄 License

MIT


