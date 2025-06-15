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
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("refreshToken");
};

export const login = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", userData.accessToken || "");
  localStorage.setItem("role", userData.user?.role || "");
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};
