
# Carpenter Workshop — Full-Stack Starter

A modern, responsive carpenter workshop website built with **React + Tailwind** (frontend) and **Node + Express + MongoDB** (backend). Includes:
- User & Admin roles (JWT)
- Product management (admin)
- Image upload (local via Multer; switch to Cloudinary easily)
- Booking system with **email notification** (Nodemailer / Gmail)
- Contact form

## Project Structure
```
carpenter-workshop/
  client/    # React + Vite + Tailwind
  server/    # Express + Mongo + JWT + Multer + Nodemailer
```

## Quick Start

### 1) Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB and Gmail App Password
npm install
npm run dev
```
Backend runs on **http://localhost:4000**

### 2) Frontend
```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

Ensure VITE_API_BASE in `client/.env` matches backend: `http://localhost:4000/api`

## Demo Credentials (auto-seeded)
- Admin: `admin@demo.com` / `admin123`
- User: `user@demo.com` / `user123`

## Notes
- Email notifications require Gmail App Password (set `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` in server `.env`).
- For production image hosting, replace local `multer` with Cloudinary SDK.
- This is a starter; extend with search, filters, booking status, and user booking history as needed.
