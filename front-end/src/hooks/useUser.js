import { useState, useEffect } from 'react';
import userService from '../services/userService';

/**
 * Hook để lấy và quản lý thông tin người dùng
 */
const useUser = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserProfile();
        if (response && response.data) {
          setUser(response.data);
          setIsAdmin(response.data.role === 'admin');
          setIsEmployee(response.data.role === 'employee');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Không thể lấy thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { user, isAdmin, isEmployee, loading, error };
};

export default useUser; 