import {jwtDecode} from "jwt-decode";

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
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