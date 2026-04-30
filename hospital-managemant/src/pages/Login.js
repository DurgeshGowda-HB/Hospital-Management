import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
  <div style={styles.container}>
    <form onSubmit={handleLogin} style={styles.card}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        style={styles.input}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        style={styles.input}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button}>Login</button>

      {/* 👇 Signup Option */}
      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "#007bff" }}>
          Sign Up
        </Link>
      </p>
    </form>
  </div>
);
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;