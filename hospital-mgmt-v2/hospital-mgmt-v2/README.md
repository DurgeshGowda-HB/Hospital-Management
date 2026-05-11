# 🏥 MediCare Hospital Management System (v2)

A complete MERN stack Hospital Management System with **3 fully separate login systems and dashboards** for Admin, Doctor, and Patient.

---

## 🚀 Quick Start

### 1. Clone / Extract the project
```
hospital-mgmt-v2/
├── backend/
└── frontend/
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run dev    # development
npm start      # production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`
Backend runs on: `http://localhost:5000`

---

## 🔐 Login URLs

| Role    | Login URL            | Dashboard URL           |
|---------|----------------------|-------------------------|
| Admin   | `/admin/login`       | `/admin/dashboard`      |
| Doctor  | `/doctor/login`      | `/doctor/dashboard`     |
| Patient | `/patient/login`     | `/patient/dashboard`    |

---

## 👤 Create Admin User

Since admin can't self-register, add one directly in MongoDB Atlas:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@hospital.com",
  password: "$2a$12$YOUR_BCRYPT_HASH",  // bcrypt hash of your password
  role: "admin",
  isActive: true
})
```

**OR** use this Node.js script to seed an admin:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('Admin@123', 12);
  await User.create({ name: 'Hospital Admin', email: 'admin@hospital.com', password: hash, role: 'admin', isActive: true });
  console.log('Admin created: admin@hospital.com / Admin@123');
  process.exit(0);
});
"
```

---

## 📁 Project Structure

```
backend/
├── middleware/auth.js        # protect, adminOnly, doctorOnly, patientOnly
├── models/
│   ├── User.js               # name, email, password, role (admin/doctor/patient)
│   ├── Doctor.js             # doctor profile (specialization, fee, etc)
│   ├── Patient.js            # patient profile
│   └── Appointment.js        # appointments
├── routes/
│   ├── auth.js               # /api/auth/login, /admin/login, /doctor/login, /patient/login
│   ├── admin.js              # /api/admin/stats, /users
│   ├── doctorRoutes.js       # /api/doctor/appointments, /stats (doctorOnly)
│   ├── patientRoutes.js      # /api/patient/appointments, /doctors (patientOnly)
│   ├── doctors.js            # public doctor listing
│   └── appointments.js       # general appointments
└── server.js

frontend/src/
├── context/AuthContext.js    # loginAs(role, email, pass)
├── components/
│   └── ProtectedRoute.js     # role-based route guard
├── services/api.js           # all API calls
└── pages/
    ├── admin/                # AdminLogin, AdminDashboard, ManageUsers, ManageDoctors, ManageAppointments
    ├── doctor/               # DoctorLogin, DoctorDashboard, DoctorAppointments, Prescriptions
    └── patient/              # PatientLogin, PatientDashboard, BookAppointment, PatientAppointments, PatientProfile
```

---

## 🔒 Security Architecture

- **Backend** enforces role checks via middleware:
  ```js
  router.get('/stats', protect, adminOnly, handler)    // Admin only
  router.get('/appointments', protect, doctorOnly, handler)  // Doctor only
  router.post('/appointments', protect, patientOnly, handler) // Patient only
  ```
- **Frontend** role-based `ProtectedRoute` redirects unauthorized users
- JWT tokens stored in `localStorage`
- Passwords hashed with bcrypt (12 rounds)

---

## 🌟 Features

### Admin
- Stats overview (users, doctors, patients, appointments)
- Manage all users (activate/deactivate/delete)
- View all doctors and appointments

### Doctor
- Dashboard with today's appointments
- Update appointment status (pending → confirmed → completed)
- Issue and view prescriptions

### Patient
- Book appointments with doctor selection + time slots
- View full appointment history
- Cancel pending appointments
- Update personal profile

---

## ⚙️ Environment Variables

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
PORT=5000
```
