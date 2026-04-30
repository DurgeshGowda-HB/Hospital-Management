import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 300);
  }, []);

  return (
    <div style={styles.container}>
      
      <h1 style={{
        ...styles.title,
        opacity: showText ? 1 : 0,
        transform: showText ? "translateY(0)" : "translateY(-20px)",
      }}>
        🏥 Hospital Management System
      </h1>

      <p style={{
        ...styles.quote,
        opacity: showText ? 1 : 0,
      }}>
        "Where technology meets care — improving lives one patient at a time."
      </p>

      <div style={styles.buttons}>
        <Link to="/login">
          <button style={styles.loginBtn}>Login</button>
        </Link>

        <Link to="/register">
          <button style={styles.registerBtn}>Register</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #155535, #00fe94)",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "40px",
    fontWeight: "bold",
    transition: "all 0.8s ease",
  },
  quote: {
    fontSize: "18px",
    marginTop: "15px",
    maxWidth: "500px",
    transition: "opacity 1.5s ease",
  },
  buttons: {
    marginTop: "30px",
  },
  loginBtn: {
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    background: "#fff",
    color: "#007bff",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
  },
  registerBtn: {
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    background: "#8c0de0",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Home;