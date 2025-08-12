
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  if (role === "isStaff" || role == "isHr") {
    return <Navigate to="/unauth" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoutes;
