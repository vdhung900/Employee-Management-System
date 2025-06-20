import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function AuthGuard({ children }) {
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthGuard;
