import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import PatientRegistration from "./pages/PatientRegistration";
import Appointment from "./pages/Appointment";
import DoctorList from "./pages/DoctorList";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />

        <Route path="/patients" element={<PatientRegistration />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/doctors" element={<DoctorList />} />
      </Routes>
    </Router>
  );
}

export default App;