import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const PrivateRoute = ({ roles = [] }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const userRole = localStorage.getItem('role');

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log('run 1')

  if (roles.length > 0 && !roles.includes(userRole)) {
    let redirectTo = '/employee/dashboard';
    if (userRole === 'admin') redirectTo = '/admin/dashboard';
    else if (userRole === 'manager' || userRole === 'employee' || userRole === 'hr') redirectTo = '/employee/dashboard';
    
    return <Navigate to={redirectTo} replace />;
  }

  console.log('run run')

  return <Outlet />;
};

export default PrivateRoute; 
