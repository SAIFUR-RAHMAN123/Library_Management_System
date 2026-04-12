import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      navigate("/admin", { replace: true });
    } else {
      setError("Wrong username or password!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>⚙️ Admin Login</h2>
        <p>BookManager Admin Panel</p>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>
        {error && <span className="error">{error}</span>}
        <button onClick={handleLogin}>Login</button>
        <a href="/">Back to Library</a>
      </div>
    </div>
  );
}

export default AdminLogin;