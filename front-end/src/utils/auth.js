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
  localStorage.setItem('role', 'employee');
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
}; 
