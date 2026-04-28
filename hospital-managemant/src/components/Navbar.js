import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#007bff", color: "white" }}>
      <h2>Hospital System</h2>

      <div>
        <Link to="/" style={{ margin: "10px", color: "white" }}>Home</Link>
        <Link to="/login" style={{ margin: "10px", color: "white" }}>Login</Link>
        <Link to="/register" style={{ margin: "10px", color: "white" }}>Register</Link>
        <Link to="/dashboard" style={{ margin: "10px", color: "white" }}>Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;