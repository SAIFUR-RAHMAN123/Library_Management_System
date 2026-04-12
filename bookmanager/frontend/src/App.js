import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route
          path="/admin/login"
          element={<AdminLogin setIsAdmin={setIsAdmin} />}
        />
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard setIsAdmin={setIsAdmin} /> : <Navigate to="/admin/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;