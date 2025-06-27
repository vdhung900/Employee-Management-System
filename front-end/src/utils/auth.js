import {jwtDecode} from "jwt-decode";
import {Navigate} from "react-router-dom";
import React from "react";

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.clear();
      let redirectTo = '/403';
      return <Navigate to={redirectTo} replace state={{ unauthorized: true }} />;
    }
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.clear();
};

export const login = (loginData) => {
  const decode = jwtDecode(loginData.accessToken);
  const permissionList = decode?.permissions.map(item => item.path);
  localStorage.setItem("user", JSON.stringify(loginData.user));
  localStorage.setItem("accessToken", loginData.accessToken || "");
  localStorage.setItem("refreshToken", loginData.refreshToken || "");
  localStorage.setItem("role", decode?.role.code);
  localStorage.setItem("permissions", JSON.stringify(permissionList));
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};
