import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = token ? JSON.parse(atob(token.split(".")[1])).role : null;

    if (!token) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
          />
        </Routes>
      </BrowserRouter>
  );
}
export default App;