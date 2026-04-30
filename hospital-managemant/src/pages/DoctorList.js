import React, { useEffect, useState } from "react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctors List</h1>

      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          style={{
            border: "1px solid #ccc",
            margin: "15px 0",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h2>{doctor.name}</h2>
          <p><b>Specialization:</b> {doctor.specialization}</p>
          <p><b>Experience:</b> {doctor.experience} years</p>
          <p><b>Fees:</b> ₹{doctor.fees}</p>
          <p><b>Availability:</b> {doctor.availability}</p>
          <p><b>Department:</b> {doctor.department}</p>
          <p><b>Rating:</b> ⭐ {doctor.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;