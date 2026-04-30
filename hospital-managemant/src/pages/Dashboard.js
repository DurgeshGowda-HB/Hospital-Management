import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>

      <div style={styles.cardContainer}>
        <Link to="/patients" style={styles.card}>Patient Registration</Link>
        <Link to="/appointments" style={styles.card}>Appointments</Link>
        <Link to="/doctors" style={styles.card}>Doctor List</Link>
        <Link to="/profile" style={styles.card}>Profile</Link>
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "40px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap",
  },
  card: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textDecoration: "none",
    color: "black",
    width: "200px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  logoutBtn: {
    marginTop: "30px",
    padding: "10px 20px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Dashboard;