# Campus-Link Rental App

A campus-focused peer-to-peer rental marketplace built with **Node.js**, **Express**, **MongoDB**, and **React + Vite**.

Campus-Link enables students to rent and lend essential items such as tools, books, and equipment within a verified college community. The platform is designed for secure, local sharing with academic verification, asset tracking, and streamlined communications.

---

## Key Features

- College-specific marketplace filtering
- Academic verification through campus email domains
- JWT-based authentication and authorization
- Multi-image item listings with Cloudinary support
- Booking lifecycle management for rental requests and returns
- Dashboard views for lenders and renters
- In-app messaging and chat workflow support

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Frontend: React with Vite
- Authentication: JWT, bcrypt
- File uploads: Multer + Cloudinary
- Realtime: Socket.io (chat inbox and messaging)

---

## Repository Structure

- `backend/` — Express API server and business logic
- `backend/controllers/` — Route controllers
- `backend/models/` — Mongoose data models
- `backend/routes/` — API route definitions
- `backend/middleware/` — Authentication and error handling
- `backend/utils/` — Helpers for email, Cloudinary, tokens
- `client/` — React application powered by Vite
- `client/src/` — UI components, pages, and client logic

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/<repo>.git
cd "Rental App"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the required variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
MY_SECRET_KEY=your_jwt_secret
REDIS_URL=redis://127.0.0.1:6379
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
BREVO_API_KEY=your_brevo_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Frontend setup

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_BASE_URL=http://localhost:3000
```

### 4. Run the application

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd ../client
npm run dev
```

---

## API Overview

### Authentication

- `POST /api/auth/signup` — Register a new user (college email verification)
- `POST /api/auth/verify-otp` — Confirm OTP
- `POST /api/auth/resend-otp` — Resend OTP
- `POST /api/auth/login` — Authenticate and receive JWT

### Item Management

- `GET /api/item/:id` — Get item details
- `GET /api/item/my-items` — Get current user listings
- `POST /api/item/create` — Create a new item listing
- `PUT /api/item/update-status/:id` — Update item status
- `DELETE /api/item/delete/:id` — Remove item listing and Cloudinary assets

### Bookings / Exchanges

- `GET /api/booking/dashboard` — Retrieve booking dashboard data
- `PATCH /api/booking/status/:id` — Update booking status
- `PATCH /api/booking/completion/:id` — Mark item return status
- `PATCH /api/booking/penalty/:id` — Initiate penalty for damage or disputes

---

## Future Improvements

- Add Google OAuth login flow
- Implement message notifications and permanent chat history
- Add rating and review flows after booking completion
- Support scheduling reminders with CRON
- Improve category filters and search

---

## Notes

- The frontend is built with Vite and expects the backend API at `VITE_BASE_URL`
- The app relies on Cloudinary for image storage and Multer for multipart upload handling
- JWT tokens are required for all private user routes

---

## License

This project is provided as-is for educational and development use.
