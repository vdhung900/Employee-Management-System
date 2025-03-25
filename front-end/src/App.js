import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LoginScreenOld from "./components/LoginScreen";
import TopBar from "./components/TopBar";
import Home from "./components/Home";
import EmployeeHome from "./components/EmployeeHome";
import Sidebar from "./components/SideBar";
import { Container, Spinner, Alert } from "react-bootstrap";
import EmployeeList from "./components/employees/EmployeeList";
import EmployeeForm from "./components/employees/EmployeeForm";
import EmployeeDetail from "./components/employees/EmployeeDetail";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import RegisterScreen from "./components/auth/RegisterScreen";
import LoginScreen from "./components/auth/LoginScreen";
import SalaryList from "./components/salary/SalaryList";
import SalaryForm from "./components/salary/SalaryForm";
import SalaryDetail from "./components/salary/SalaryDetail";
import DepartmentList from "./components/departments/DepartmentList";
import DepartmentForm from "./components/departments/DepartmentForm";
import DepartmentDetail from "./components/departments/DepartmentDetail";
import AttendancePage from "./components/attendance/AttendancePage";
import NotificationList from "./components/notifications/NotificationList";
import UserAttendance from './components/userPage/UserAttendance';
import ActivityLogList from "./components/activityLogs/ActivityLogList";
import BackupPage from "./components/backup/BackupPage";
import userService from "./services/userService";
import useRoleCheck from "./hooks/useRoleCheck";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./components/userPage/UserProfile";
import UserNotifications from "./components/userPage/UserNotifications";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" />;
};

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <TopBar />
        <div className="flex-grow-1 overflow-auto p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

// Component con để kiểm tra vai trò người dùng
const AppRoutes = () => {
  const { auth } = useAuth();
  
  // Hiển thị giao diện đăng nhập nếu không có auth
  if (!auth) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  
  // Sử dụng component UserCheck để có thể sử dụng useNavigate với useRoleCheck
  return <UserCheck />;
};

// Component con này đảm bảo useNavigate hoạt động với useRoleCheck
const UserCheck = () => {
  const { isEmployee, isAdmin, loading, error } = useRoleCheck();
  
  // Hiển thị loading trong khi kiểm tra vai trò
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">
          Lỗi khi kiểm tra vai trò: {error}
        </Alert>
      </Container>
    );
  }

  console.log("Rendering with roles - isEmployee:", isEmployee, "isAdmin:", isAdmin);

  return (
    <Container fluid className="p-0">
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              {isEmployee ? (
                // Giao diện cho Employee
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<EmployeeHome />} />
                  <Route path="/user-attendance" element={<UserAttendance />} />
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/user-notifications" element={<UserNotifications />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              ) : (
                // Giao diện cho Admin
                <AdminLayout>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/home" replace />}
                    />
                    <Route path="/home" element={<Home />} />
                    <Route
                      path="/employees"
                      element={<EmployeeList />}
                    />
                    <Route
                      path="/employees/new"
                      element={<EmployeeForm />}
                    />
                    <Route
                      path="/employees/:id"
                      element={<EmployeeDetail />}
                    />
                    <Route
                      path="/employees/:id/edit"
                      element={<EmployeeForm />}
                    />
                    <Route path="/salaries" element={<SalaryList />} />
                    <Route
                      path="/salaries/new"
                      element={<SalaryForm />}
                    />
                    <Route
                      path="/salaries/:id"
                      element={<SalaryDetail />}
                    />
                    <Route
                      path="/salaries/:id/edit"
                      element={<SalaryForm />}
                    />
                    <Route
                      path="/departments"
                      element={<DepartmentList />}
                    />
                    <Route
                      path="/departments/new"
                      element={<DepartmentForm />}
                    />
                    <Route
                      path="/departments/:id"
                      element={<DepartmentDetail />}
                    />
                    <Route
                      path="/departments/:id/edit"
                      element={<DepartmentForm />}
                    />
                    <Route
                      path="/attendances"
                      element={<AttendancePage />}
                    />
                    <Route
                      path="notifications"
                      element={<NotificationList />}
                    />
                    <Route
                      path="action-histories"
                      element={<ActivityLogList />}
                    />
                    <Route
                      path="/user-attendance"
                      element={<UserAttendance/>}
                    />
                    <Route path="backups" element={<BackupPage />} />
                  </Routes>
                </AdminLayout>
              )}
            </PrivateRoute>
          }
        />
      </Routes>
    </Container>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
