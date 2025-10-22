# 🚗 Car Rental Management System - 2025

This project is a full‑stack **Car Rental Management System** built using **Node.js (Express)** and **PostgreSQL**. It enables administrators and clients to manage vehicles, rentals, user authentication, and document verification within a modern, secure web environment.

---

## 🔹 Main Features

- Secure user registration & authentication (Passport.js + sessions)
- Role-based access control: **Admin**, **Employee**, **Client**
- Vehicle management (create, read, update, delete)
- Rental lifecycle: request, approve, active, returning, completed, canceled
- Dynamic filtering and search (brand, model, price, transmission, capacity, etc.)
- File uploads (Multer) + Cloud storage (Cloudinary)
- Email notifications (Nodemailer) and SMS (Twilio)
- Automatic status updates for rentals (scheduled job)
- Reviews, ratings, favorites, and promo codes
- JWT-based recovery links and token management

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | EJS, HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | Passport.js (local), JWT |
| Storage | Cloudinary |
| Messaging | Twilio, Nodemailer |
| File Uploads | Multer |
| Deployment | Vercel / Render / Heroku |

---

## ⚙️ Installation & Setup

1. Clone repository
```bash
git clone https://github.com/yourusername/car-rental-system.git
cd car-rental-system
```

2. Install dependencies
```bash
npm install
```

3. Environment variables
Create a `.env` file in the project root with the following (example):
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/pfe12
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=4000
```

4. Run the server
```bash
npm run dev    # for development (requires nodemon)
npm start      # for production
```
Open: `http://localhost:4000`

---

## 🛣️ API Routes Overview

| Route | Purpose |
|-------|---------|
| `/api/users` | User registration, login, profile, verification |
| `/api/email` | Email sending (verification, notifications) |
| `/api/sms` | SMS verification (Twilio) |
| `/api/orders` | Rentals: create, update, list, status changes |
| `/api/feedback` | Reviews and ratings |
| `/api/vehicles` | Vehicle CRUD and listings |
| `/api/docs` | User document uploads & verification |
| `/api/discounts` | Promo management |

---

## 🔐 Security & Best Practices

- Use HTTPS in production
- Hash passwords with **bcrypt**
- Use sessions and secure cookies for authentication
- Validate and sanitize all inputs before DB queries
- Use parameterized queries (pg) to prevent SQL injection
- Limit file upload types and sizes; validate on server
- Rotate secrets and avoid committing `.env` to Git

---

## 📦 Useful Scripts

- `npm run dev` — start dev server with nodemon  
- `npm start` — start production server  
- `npm test` — run tests (if configured)

---

## 🧑‍💻 Authors

- **Ismail Sdiki** — Full Stack Developer  
- **Oulhadj Oday** — Backend Engineer

Contact: ismailsdiki5@gmail.com | oulhadjoday@gmail.com

---

## 📜 License

This project is licensed under the **MIT License** — see `LICENSE` for details.

---

*Generated for 2025 — Prepared for GitHub & academic submission.*
