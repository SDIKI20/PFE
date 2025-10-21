# 🚗 Car Rental Platform (Node.js + Express + PostgreSQL)

This project is a **vehicle rental management system** built with **Node.js, Express, PostgreSQL, Passport.js, and Cloudinary**.  
It allows users to browse, rent, and manage vehicles, and includes a full dashboard for administrators.

---

## 📋 Features

### 🧑‍💻 For Clients
- User registration and authentication (Passport.js)
- Browse available cars with advanced filters
- Rent and return vehicles
- View rental history
- Leave reviews and ratings
- Upload identification documents for verification
- Manage favorite cars

### ⚙️ For Admins
- Dashboard with reports and statistics
- Manage users, vehicles, brands, and offices
- Manage rental orders and their statuses
- Manage discounts and promotions
- Automatic status updates for rentals (via `setInterval` job)

### 🌐 Other
- EJS templating engine for dynamic views
- Cloudinary integration for image storage
- PostgreSQL database connection pool
- JWT for secure token-based actions
- Flash messages for user feedback
- Session handling with `express-session`
- File uploads handled with `multer`
- Full REST API structure (routes, controllers)

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Server | Node.js + Express.js |
| Database | PostgreSQL |
| ORM/Driver | pg (node-postgres) |
| Authentication | Passport.js (Local Strategy) |
| File Uploads | Multer + Cloudinary |
| Frontend | EJS (Embedded JavaScript Templates) |
| Styling | CSS, Bootstrap |
| Security | Bcrypt, JWT |
| Notifications | Nodemailer (Email) |
| Environment | dotenv |

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/car-rental-platform.git
cd car-rental-platform
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env` file at the root with:

```env
PORT=4000
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://username:password@localhost:5432/car_rental
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PROD_URL=https://your-production-domain.com
```

---

## 🗄️ Database Structure (PostgreSQL)

Main tables used:
- `users`
- `vehicles`
- `brands`
- `rentals`
- `office`
- `reviews`
- `favorites`
- `vehicle_stock`
- `user_tokens`
- `promo`
- `users_documents`
- `users_verification`

Make sure your database is initialized before running the server.

---

## 🚀 Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Then open:
```
http://localhost:4000
```

---

## 🧪 API Routes Overview

| Endpoint | Description |
|-----------|-------------|
| `/api/users` | Manage users |
| `/api/email` | Send verification and info emails |
| `/api/sms` | Manage SMS verification |
| `/api/orders` | Handle rental orders |
| `/api/feedback` | Handle reviews and ratings |
| `/api/vehicles` | Manage vehicle listings |
| `/api/docs` | Manage user documents |
| `/api/discounts` | Manage discount and promo codes |

---

## 📸 Image Uploads

- Handled by **Multer** and **Cloudinary**
- Profile images stored under `profile_images/`
- Vehicle images stored under `vehicles/`

---

## 🔒 Authentication & Sessions

- Implemented using **Passport.js**
- Local strategy for login with email/password
- Sessions stored via `express-session`
- JWT used for token-based recovery actions

---

## 🕒 Automatic Rental Status Updates

A background job runs every hour to update rental statuses:
```js
setInterval(updateRentalStatuses, 60 * 60 * 1000);
```
- `approved → active` (if start date reached)
- `active → returning` (if end date passed)
- `pending → canceled` (if end date passed)

---

## 🖥️ Views

Views are rendered with **EJS** and located in the `/views` directory:
- `index.ejs` → Home page
- `home.ejs` → Main user pages (cars, favorites, docs, rentals)
- `dashboard.ejs` → Admin dashboard
- `login.ejs`, `signup.ejs`, `recover.ejs` → Auth pages
- `p404.ejs` → Error page

Static files are served from `/public`.

---

## 👨‍💻 Authors

**Your Name**  
📧 Email: youremail@example.com  
🌐 GitHub: [github.com/yourusername](https://github.com/yourusername)

---

## 📜 License
This project is licensed under the MIT License.

