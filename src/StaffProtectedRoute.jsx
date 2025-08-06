import { Navigate, useLocation } from "react-router-dom";


const StaffProtectedRoute = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");


  if (role === "isAdmin" || role == "isHr") {
    return <Navigate to="/unauth" replace state={{ from: location }} />;
  }

  return children;
}

export default StaffProtectedRoute
