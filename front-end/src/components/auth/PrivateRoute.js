import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {isAuthenticated} from '../../utils/auth';
import {jwtDecode} from "jwt-decode";

const PrivateRoute = () => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const userRole = localStorage.getItem('role');
    const currentPath = location.pathname;
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null) {
        localStorage.clear();
        let redirectTo = '/403';
        return <Navigate to={redirectTo} replace state={{unauthorized: true}}/>;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
        localStorage.clear();
        let redirectTo = '/403';
        return <Navigate to={redirectTo} replace state={{unauthorized: true}}/>;
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    const isDashboard =
        (userRole === 'admin' && currentPath === '/admin/dashboard') ||
        (userRole !== 'admin' && currentPath === '/employee/dashboard');

    if (!permissions.includes(currentPath) && !isDashboard) {
        let redirectTo = '/403';
        // if (userRole === 'admin') redirectTo = '/admin/dashboard';
        return <Navigate to={redirectTo} replace state={{unauthorized: true}}/>;
    }

    return <Outlet/>;
};

export default PrivateRoute; 
