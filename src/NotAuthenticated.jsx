import { Navigate, Outlet } from "react-router-dom";

const NotAuthenticated = () => {
  const token = localStorage.getItem("token");

  // If token exists, send to dashboard directly instead of null or "/" main page
  if (token) {
    const role = localStorage.getItem("role");
    switch (role) {
      case "isAdmin":
        return <Navigate to="/adminDashboard" replace />;
      case "isHr":
        return <Navigate to="/hrDashboard" replace />;
      case "isStaff":
        return <Navigate to="/staffDashboard" replace />;
      default:
        return <Navigate to="/welcome" replace />;
    }
  }

  return <Outlet />;
};

export default NotAuthenticated;
