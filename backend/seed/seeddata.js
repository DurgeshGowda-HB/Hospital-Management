import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";

dotenv.config();
connectDB();

const doctors = [
  {
    name: "Dr Kumar",
    specialization: "Cardiology",
    experience: 10,
    fees: 700,
    availability: "9 AM - 5 PM",
    department: "Heart Care",
    rating: 4.8,
    email: "drkumar@gmail.com",
    phone: "9876543210",
  },
  {
    name: "Dr Priya",
    specialization: "Dental",
    experience: 6,
    fees: 500,
    availability: "10 AM - 4 PM",
    department: "Dental Care",
    rating: 4.5,
    email: "drpriya@gmail.com",
    phone: "9876543211",
  },
  {
    name: "Dr Sharma",
    specialization: "Neurology",
    experience: 12,
    fees: 900,
    availability: "11 AM - 6 PM",
    department: "Brain Care",
    rating: 4.9,
    email: "drsharma@gmail.com",
    phone: "9876543212",
  },
];

const seedData = async () => {
  try {
    await Doctor.deleteMany();
    await User.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();

    const insertedDoctors = await Doctor.insertMany(doctors);

    const users = await User.insertMany([
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: "123456",
        role: "patient",
        phone: "9876500001",
      },
      {
        name: "Priya",
        email: "priya@gmail.com",
        password: "123456",
        role: "patient",
        phone: "9876500002",
      },
      {
        name: "Aman",
        email: "aman@gmail.com",
        password: "123456",
        role: "patient",
        phone: "9876500003",
      },
    ]);

    const patients = await Patient.insertMany([
      {
        userId: users[0]._id,
        age: 22,
        gender: "Male",
        bloodGroup: "O+",
        address: "Mysore",
        emergencyContact: "9876511111",
        medicalHistory: "Asthma",
      },
      {
        userId: users[1]._id,
        age: 24,
        gender: "Female",
        bloodGroup: "A+",
        address: "Bangalore",
        emergencyContact: "9876522222",
        medicalHistory: "No major history",
      },
      {
        userId: users[2]._id,
        age: 21,
        gender: "Male",
        bloodGroup: "B+",
        address: "Mandya",
        emergencyContact: "9876533333",
        medicalHistory: "Diabetes",
      },
    ]);

    await Appointment.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: insertedDoctors[0]._id,
        appointmentDate: new Date(),
        appointmentTime: "10:00 AM",
        status: "confirmed",
        reason: "Chest Pain",
        paymentStatus: "paid",
      },
      {
        patientId: patients[1]._id,
        doctorId: insertedDoctors[1]._id,
        appointmentDate: new Date(),
        appointmentTime: "11:30 AM",
        status: "pending",
        reason: "Tooth Pain",
        paymentStatus: "pending",
      },
      {
        patientId: patients[2]._id,
        doctorId: insertedDoctors[2]._id,
        appointmentDate: new Date(),
        appointmentTime: "2:00 PM",
        status: "completed",
        reason: "Headache",
        paymentStatus: "paid",
      },
    ]);

    await MedicalRecord.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: insertedDoctors[0]._id,
        diagnosis: "Mild Heart Blockage",
        prescription: "Medicine + Exercise",
        notes: "Avoid oily food",
      },
      {
        patientId: patients[1]._id,
        doctorId: insertedDoctors[1]._id,
        diagnosis: "Tooth Infection",
        prescription: "Antibiotics",
        notes: "Follow-up in 1 week",
      },
      {
        patientId: patients[2]._id,
        doctorId: insertedDoctors[2]._id,
        diagnosis: "Migraine",
        prescription: "Pain Relief Tablets",
        notes: "Sleep properly",
      },
    ]);

    console.log("All data seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();