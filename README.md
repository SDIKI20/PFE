# 🚗 Car Rental Management System (2025)

![Car Rental Banner](https://cdn.dribbble.com/users/181428/screenshots/16895386/media/99c4bfc6cfb29fa62b9f2da9e515ad4d.png)

## 📖 Overview
The **Car Rental Management System** is a full-stack web application designed to streamline vehicle rental operations for both clients and administrators.  
Built with **Node.js**, **Express**, **PostgreSQL**, and **EJS**, this platform provides a modern, responsive, and secure interface for managing vehicles, customers, rentals, payments, and user authentication.

---

## 🌐 Live Demo & Preview
🎥 **Demo Video (Coming Soon)**  
🖥️ Mockup Example:
![Dashboard Preview](https://cdn.dribbble.com/users/1541795/screenshots/16548014/media/b72db295c1f22bfb728fb7e8f47135ea.png)

---

## ⚙️ Tech Stack
| Category | Technology |
|-----------|-------------|
| **Frontend** | EJS Templates, HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | Passport.js, JWT |
| **Storage** | Cloudinary (Image Hosting) |
| **SMS & Email** | Twilio, Nodemailer |
| **Version Control** | Git & GitHub |
| **Deployment** | Vercel / Render |

---

## 🧩 Main Features
✅ User authentication (Login, Signup, Logout)  
✅ Email verification & 2FA via Twilio SMS  
✅ Vehicle management (CRUD)  
✅ Dynamic filters: brand, price, transmission, capacity, etc.  
✅ Rental requests & approvals system  
✅ Admin dashboard with analytics  
✅ Automatic rental status update (Active / Returning / Canceled)  
✅ File uploads using Multer + Cloudinary  
✅ Flash messages & session handling  
✅ Secure password hashing (bcrypt)  

---

## 🏗️ System Architecture
The following diagram illustrates the overall system architecture:

![Architecture Diagram](https://cdn.dribbble.com/users/938590/screenshots/17336752/media/1880b6fd784c6b12b81b44e36db4df44.png)

---

## 💾 Database Schema Overview
Simplified view of main tables:

| Table | Description |
|--------|--------------|
| `users` | Registered users and roles (Admin, Client) |
| `vehicles` | Vehicle catalog with brand, color, specs |
| `rentals` | Rental contracts linking users and vehicles |
| `reviews` | Feedback and star ratings |
| `favorites` | User favorite vehicles |
| `promo` | Discounts and promo codes |
| `office` | Company branch locations |

---

## 🔐 Authentication Flow
1. User registers and uploads ID documents.  
2. Verification email + optional SMS via Twilio.  
3. Upon success, user gains access to rental dashboard.  
4. Login attempts are logged with timestamps & platform info.  
5. Failed attempts trigger email notifications.

![Login Flow](https://cdn.dribbble.com/users/799181/screenshots/17197167/media/27649d164fd8b6c19b1afbb1a8cd4b16.png)

---

## 🧠 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/car-rental-system.git
cd car-rental-system
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `.env` File
Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/pfe12
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=+1234567890
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4000
```

### 4️⃣ Run the Server
```bash
npm start
```
Server will start at: `http://localhost:4000`

---

## 📦 Scripts

| Command | Description |
|----------|--------------|
| `npm start` | Run the production server |
| `npm run dev` | Run server with nodemon for development |
| `npm test` | Run Jest or Pytest (for API testing) |

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](https://cdn.dribbble.com/userupload/6201143/file/original-97a5df9cf1c3c82e8f4e7e6e57d5e40b.png)

### 🚘 Vehicle List
![Vehicle List](https://cdn.dribbble.com/userupload/6996145/file/original-51e2f303b90925b9f2f9330b93a5de0d.png)

### 📊 Admin Dashboard
![Dashboard](https://cdn.dribbble.com/userupload/5805988/file/original-1929f3a9b4f8f3c2c03a3d4a6cf4cdb2.png)

---

## 🧑‍💻 Authors
**Developed by:**  
- **Ismail Sdiki** – Frontend developer  
- **Oulhadj Oday** – Fullstack developer  

📧 Contact: ismailsdiki5@gmail.com | oulhadjoday@gmail.com  

---

## 📜 License
This project is licensed under the **MIT License** – you’re free to use and modify it with proper attribution.

---

⭐ *If you found this project helpful, please consider giving it a star on GitHub!* ⭐
