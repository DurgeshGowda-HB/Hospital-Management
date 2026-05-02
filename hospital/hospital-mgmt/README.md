# 🏥 MediCare Hospital Management System
### Full-Stack MERN Application | Submission Project

---

## 📋 Project Overview

A complete Hospital Management System built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), featuring JWT authentication, role-based access control, and full CRUD operations.

---

## ✅ Requirements Fulfilled

### Common Mandatory Pages
| Page | Route | Status |
|---|---|---|
| Home / Landing Page | `/` | ✅ |
| Login Page | `/login` | ✅ |
| Registration Page | `/register` | ✅ |
| Dashboard | `/dashboard` | ✅ |
| Profile Page | `/profile` | ✅ |
| Admin Panel | `/admin` | ✅ |

### Hospital Management Pages
| Page | Route | Status |
|---|---|---|
| Patient Registration | `/patient-registration` | ✅ |
| Appointment Booking | `/book-appointment` | ✅ |
| Doctor List | `/doctors` | ✅ |
| Appointments Management | `/appointments` | ✅ |

### Technical Stack
- ✅ **React** frontend (components, routing with React Router v6)
- ✅ **Node.js + Express** backend (REST API)
- ✅ **MongoDB** database (Mongoose ODM)
- ✅ **API integration** (Full CRUD for all entities)
- ✅ **JWT Authentication** with role-based access (patient / doctor / admin)

---

## 🗂️ Project Structure

```
hospital-mgmt/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js          # User model with bcrypt password hashing
│   │   ├── Patient.js       # Patient health record model
│   │   ├── Doctor.js        # Doctor profile model
│   │   └── Appointment.js   # Appointment model
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Me
│   │   ├── patients.js      # Patient CRUD
│   │   ├── doctors.js       # Doctor CRUD
│   │   ├── appointments.js  # Appointment CRUD + booking
│   │   ├── admin.js         # Admin stats + user management
│   │   └── profile.js       # Profile view/update/password
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js    # Sidebar navigation layout
    │   │   └── Layout.css
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state
    │   ├── pages/
    │   │   ├── HomePage.js          # Landing page
    │   │   ├── LoginPage.js         # Login
    │   │   ├── RegisterPage.js      # Registration
    │   │   ├── Dashboard.js         # Dashboard (role-aware)
    │   │   ├── ProfilePage.js       # Profile + password
    │   │   ├── AdminPanel.js        # Admin panel
    │   │   ├── DoctorList.js        # Doctor directory
    │   │   ├── PatientRegistration.js  # Patient health record
    │   │   ├── AppointmentBooking.js   # Book appointment
    │   │   └── AppointmentsPage.js     # Appointments list
    │   ├── utils/
    │   │   └── api.js       # Axios API calls
    │   ├── App.js           # Routes + protected routes
    │   ├── index.js
    │   └── index.css        # Global styles
    └── package.json
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

### 1. Clone & Setup Backend

```bash
cd hospital-mgmt/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET

# Start backend (development)
npm run dev

# OR production
npm start
```

Backend runs on: **http://localhost:5000**

### 2. Setup Frontend

```bash
cd hospital-mgmt/frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Patients
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/patients` | Admin |
| GET | `/api/patients/me` | Patient |
| POST | `/api/patients/register` | Protected |
| PUT | `/api/patients/:id` | Protected |
| DELETE | `/api/patients/:id` | Admin |

### Doctors
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/doctors` | Public |
| GET | `/api/doctors/:id` | Public |
| POST | `/api/doctors` | Admin |
| PUT | `/api/doctors/:id` | Protected |
| DELETE | `/api/doctors/:id` | Admin |

### Appointments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/appointments` | Protected (role-filtered) |
| GET | `/api/appointments/:id` | Protected |
| POST | `/api/appointments` | Protected |
| PUT | `/api/appointments/:id` | Protected |
| DELETE | `/api/appointments/:id` | Protected (cancels) |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/users` | Admin |
| PUT | `/api/admin/users/:id` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |

### Profile
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/profile` | Protected |
| PUT | `/api/profile` | Protected |
| PUT | `/api/profile/password` | Protected |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Patient** | Register, book appointments, view own appointments, manage health record |
| **Doctor** | View own appointments, mark as complete |
| **Admin** | Full access — manage users, view stats, all appointments |

---

## 🔐 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospital_mgmt
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 🎨 Features

- **Dark theme UI** with teal/navy color scheme
- **Responsive layout** with collapsible sidebar
- **Role-based routing** — admin/doctor/patient views
- **Conflict detection** in appointment booking
- **Real-time toast notifications**
- **Protected routes** with automatic redirect
- **Password hashing** with bcrypt
- **JWT** stored in localStorage, sent via Authorization header

---

*Built as a MERN Stack submission project — Hospital Management System*
