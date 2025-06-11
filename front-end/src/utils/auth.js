export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const login = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', JSON.stringify(userData));
  // sua thong tin o day
  localStorage.setItem('role', 'admin');
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
}; 
