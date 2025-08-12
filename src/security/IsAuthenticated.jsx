import { Navigate, Outlet, useLocation } from "react-router-dom";

const IsAuthenticated = () => {
  
 const location = useLocation();

  const token = localStorage.getItem("token");
 
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet/>;
}

export default IsAuthenticated
