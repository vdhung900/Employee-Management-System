import {jwtDecode} from "jwt-decode";
import {Navigate} from "react-router-dom";
import React from "react";

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      throw new Error("Token không tồn tại hoặc sai định dạng");
    }

    const decoded = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.clear();
      return null;
    }

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error.message);
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
  localStorage.setItem("accessToken", loginData.accessToken.toString() || "");
  localStorage.setItem("refreshToken", loginData.refreshToken || "");
  localStorage.setItem("role", decode?.role.code);
  localStorage.setItem("permissions", JSON.stringify(permissionList));

};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};