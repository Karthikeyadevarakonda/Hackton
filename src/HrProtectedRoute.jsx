import { Navigate, useLocation } from "react-router-dom";


const HrProtectedRoute = ({children}) => {
const location = useLocation();
const role = localStorage.getItem("role");

  if (role === "isStaff" || role == "isAdmin") {
    return <Navigate to="/unauth" replace state={{ from: location }} />;
  }

  return children;
}

export default HrProtectedRoute



