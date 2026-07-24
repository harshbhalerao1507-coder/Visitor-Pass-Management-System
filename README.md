# Visitor Pass Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing visitors, appointments, digital visitor passes, and check-in/check-out operations with secure role-based authentication.

---

## 🚀 Live Demo

### Frontend
https://visitor-pass-management-harsh.netlify.app

### Backend API
https://visitor-pass-management-system-52nv.onrender.com

---

## ✨ Features

- User Registration & Login
- JWT Authentication
- Role-Based Authorization
- Visitor Management (CRUD)
- Appointment Management
- Digital Pass Generation
- QR Code Generation
- Check-In & Check-Out
- Dashboard with Statistics
- User Profile
- Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- QRCode
- PDFKit

---

## 📁 Project Structure

```
9_assignment/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── package.json
│   └── ...
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd 9_assignment
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET="greatestyoucaneverbe"
EXPIRE=7d
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://visitor-pass-management-system-52nv.onrender.com/api
```

---

## 👥 Roles

- Admin
- Security
- Receptionist
- Visitor

Each role has access only to authorized features.

---

## 📌 API Modules

- Authentication
- Visitors
- Appointments
- Pass Management
- Check-In / Check-Out
- Dashboard

---

## 📦 Deployment

### Frontend
Netlify

### Backend
Render

### Database
MongoDB Atlas

---

## 👨‍💻 Developed By

**Harsh Bhalerao**

Computer Engineering Student

Savitribai Phule Pune University (SPPU)

---

## 📄 License

This project is developed for educational and academic purposes.
