import React from "react";
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
import Sidebar from "./components/SideBar";
import { Container } from "react-bootstrap";
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
import AttendancePage from './pages/AttendancePage';
import NotificationList from "./components/notifications/NotificationList";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Container fluid className="p-0">
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <div className="d-flex vh-100">
                      <Sidebar />
                      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                        <TopBar />
                        <div className="flex-grow-1 overflow-auto p-3">
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
                            <Route
                              path="/salaries"
                              element={<SalaryList />}
                            />
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
                              element={<NotificationList/>}
                            />
                          </Routes>
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
