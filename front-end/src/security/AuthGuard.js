import { Navigate } from "react-router-dom";

function AuthGuard({ children }) {
  console.log(children)
  const isAuthenticated = !!localStorage.getItem("token"); // Example check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthGuard;