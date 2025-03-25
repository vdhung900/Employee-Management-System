import { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook để kiểm tra vai trò của người dùng
 */
const useRoleCheck = () => {
  const [isEmployee, setIsEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, auth } = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        
        // Kiểm tra xác thực trong context
        console.log("Auth context:", auth);
        
        // Kiểm tra xem có token trong localStorage không
        const token = localStorage.getItem('token');
        console.log("Token từ localStorage:", token ? "Token tồn tại" : "Không có token");
        
        if (!token) {
          console.log('Không tìm thấy token, chuyển hướng đến trang đăng nhập');
          handleAuthError();
          return;
        }
        
        console.log("Bắt đầu lấy thông tin profile người dùng...");
        
        // Lấy thông tin user profile
        const userData = await userService.getUserProfile();
        console.log("Kết quả API profile:", userData);
        
        if (userData) {
          setUserData(userData);
          console.log("Dữ liệu người dùng:", userData);
          
          // Kiểm tra nhiều trường hợp để xác định vai trò
          // Trường hợp 1: Có trường role rõ ràng
          if (userData.role) {
            const role = userData.role.toLowerCase();
            setIsAdmin(role === 'admin');
            setIsEmployee(role === 'employee');
            console.log(`Phát hiện trường role: ${role} => isAdmin=${role === 'admin'}, isEmployee=${role === 'employee'}`);
          }
          // Trường hợp 2: Có trường isAdmin
          else if (userData.isAdmin !== undefined) {
            setIsAdmin(userData.isAdmin === true);
            setIsEmployee(userData.isAdmin === false);
            console.log(`Phát hiện trường isAdmin: ${userData.isAdmin} => isAdmin=${userData.isAdmin === true}, isEmployee=${userData.isAdmin === false}`);
          }
          // Trường hợp 3: Nếu có liên kết với employee thì là nhân viên
          else if (userData.employeeId) {
            setIsEmployee(true);
            setIsAdmin(false);
            console.log('Phát hiện trường employeeId, xác định là nhân viên: isEmployee=true, isAdmin=false');
          }
          // Mặc định là admin nếu không xác định được
          else {
            console.log('Không tìm thấy chỉ định vai trò, mặc định là admin: isAdmin=true, isEmployee=false');
            setIsAdmin(true);
            setIsEmployee(false);
          }
        } else {
          console.log('API không trả về dữ liệu người dùng');
          throw new Error('Không thể lấy thông tin người dùng');
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra vai trò người dùng:', err);
        
        if (err.response) {
          console.error('Response error:', err.response.status, err.response.data);
        }
        
        // Xử lý lỗi 401 Unauthorized
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.log('Lỗi xác thực, chuyển hướng đến trang đăng nhập');
          handleAuthError();
        } else {
          setError(err.message || 'Lỗi kiểm tra vai trò người dùng');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [navigate, logout, auth]);

  // Hàm xử lý lỗi xác thực
  const handleAuthError = () => {
    console.log("Xử lý lỗi xác thực - xóa token và đăng xuất");
    
    // Xóa token và dữ liệu trong localStorage
    localStorage.removeItem('token');
    
    // Gọi hàm logout từ context
    if (logout) {
      logout();
      console.log("Đã gọi hàm logout từ context");
    } else {
      console.log("Không tìm thấy hàm logout trong context");
    }
    
    // Điều hướng về trang đăng nhập
    if (window.location.pathname !== '/login') {
      console.log("Chuyển hướng đến trang đăng nhập");
      navigate('/login');
    } else {
      console.log("Đã ở trang đăng nhập, không cần chuyển hướng");
    }
  };

  return { isEmployee, isAdmin, userData, loading, error };
};

export default useRoleCheck; 