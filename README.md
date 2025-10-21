# 🚗 Car Rental Management System (2025)

![Car Rental Banner](banner.png)

## 📖 Overview
The **Car Rental Management System** is a full-stack web application designed to optimize vehicle rental operations in Algeria.  
It provides a modern interface for both **clients** and **administrators**, ensuring a smooth experience for booking, managing, and monitoring car rentals.

Built with **Node.js**, **Express**, **PostgreSQL**, **EJS**, and **Cloudinary**, this system ensures reliability, scalability, and secure access control.

---

## 🖥️ Application Preview

### 🏠 Home Page
![Car Rental Banner](banner.png)

### 🚘 User Dashboard
![Dashboard Preview](dashboard_preview.png)

---

## ⚙️ Tech Stack
| Layer | Technology |
|--------|-------------|
| **Frontend** | EJS, HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | Passport.js, JWT |
| **Cloud Storage** | Cloudinary |
| **Notifications** | Twilio (SMS) & Nodemailer (Email) |
| **Deployment** | Vercel / Render |

---

## 🧩 Features
✅ User registration and login with secure sessions  
✅ Email and SMS verification (2FA)  
✅ Vehicle browsing and filtering (brand, model, type, price, etc.)  
✅ Rental booking and management  
✅ Admin dashboard for managing cars, users, and rentals  
✅ Automatic rental status updates  
✅ Document upload and verification system  
✅ Review and rating system  
✅ Cloud-based image hosting (Cloudinary)  

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
Then open: `http://localhost:4000`

---

## 📸 Screenshots

| Section | Image |
|----------|--------|
| Home Page | ![banner](banner.png) |
| User Dashboard | ![inscription](home_page.png) |

---

## 🧑‍💻 Authors
**Developed by:**  
- **Ismail Sdiki** – Full Stack Developer  
- **Oulhadj Oday** – Backend Engineer  

📧 Contact: ismailsdiki5@gmail.com | oulhadjoday@gmail.com  

---

## 📜 License
Licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

⭐ *If you found this project helpful, please give it a star on GitHub!* ⭐
