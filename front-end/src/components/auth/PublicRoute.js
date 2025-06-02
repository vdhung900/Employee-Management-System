import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const userRole = localStorage.getItem('role');

  // Nếu đã đăng nhập, chuyển hướng về dashboard tương ứng
  if (isAuth) {
    let redirectTo = '/employee/dashboard';
    if (userRole === 'admin') redirectTo = '/admin/dashboard';
    else if (userRole === 'hr') redirectTo = '/hr/dashboard';
    else if (userRole === 'manager') redirectTo = '/manager/dashboard';
    
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu chưa đăng nhập, cho phép truy cập route công khai
  return children;
};

export default PublicRoute; 
