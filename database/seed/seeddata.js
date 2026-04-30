import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Doctor from "../models/Doctor.js";

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

const seedDoctors = async () => {
  try {
    await Doctor.deleteMany();
    await Doctor.insertMany(doctors);

    console.log("Doctors seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDoctors(); // calling the function 