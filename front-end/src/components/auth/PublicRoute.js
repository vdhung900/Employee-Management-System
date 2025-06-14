import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const userRole = localStorage.getItem('role');

  if (isAuth) {
    let redirectTo = '/employee/dashboard';
    if (userRole === 'admin') redirectTo = '/admin/dashboard';
    else if (userRole === 'hr') redirectTo = '/hr/dashboard';
    else if (userRole === 'manager') redirectTo = '/manager/dashboard';
    
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute; 
