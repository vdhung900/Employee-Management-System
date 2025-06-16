import React from 'react';
import './assets/styles/global.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import EmployeeDashboard from './pages/employee/Dashboard';
import AdminDashboard from "./pages/admin/AdminDashboard";
import LogRequest from "./pages/admin/LogRequest";
import AdminAccount from "./pages/admin/AdminAccount";
import Setting from "./pages/admin/Setting";
import AdminAccountRequests from "./pages/admin/AdminAccountRequests";
import Requests from "./pages/employee/Request";
import AttendanceReview from "./pages/employee/AttendanceReview";
import Calender from "./pages/employee/Calender";
import Help from "./pages/employee/Help";
import Overtime from "./pages/employee/Overtime";
import Payroll from "./pages/employee/Payroll";
import PayrollManagement from "./pages/employee/PayrollManagement";
import Reports from "./pages/employee/Reports";
import StaffManagement from "./pages/employee/StaffManagement";
import TeamManagement from "./pages/employee/TeamManagement";
import TeamPerformance from "./pages/employee/TeamPerformance";
import NotFound from "./pages/NotFound";
import Category from "./pages/admin/Category";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/404",
    element: (
      <PublicRoute>
        <NotFound />
      </PublicRoute>
    )
  },
  {
    path: "/admin",
    element: <PrivateRoute roles={['admin']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "request-manage", element: <LogRequest /> },
          { path: "setting", element: <Setting /> },
          { path: "account-request", element: <AdminAccountRequests /> },
          { path: "admin-account", element: <AdminAccount /> },
          { path: "category", element: <Category /> },
        ]
      }
    ]
  },
  {
    path: "/employee",
    element: <PrivateRoute roles={['staff', 'manager', 'hr']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <EmployeeDashboard /> },
          { path: "dashboard", element: <EmployeeDashboard /> },
          { path: "attendance-review", element: <AttendanceReview /> },
          { path: "calender", element: <Calender /> },
          { path: "help", element: <Help /> },
          { path: "overtime", element: <Overtime /> },
          { path: "payroll", element: <Payroll /> },
          { path: "payroll-management", element: <PayrollManagement /> },
          { path: "payroll-management", element: <PayrollManagement /> },
          { path: "reports", element: <Reports /> },
          { path: "requests", element: <Requests /> },
          { path: "staff-management", element: <StaffManagement /> },
          { path: "team-management", element: <TeamManagement /> },
          { path: "team-performance", element: <TeamPerformance /> },
        ]
      }
    ]
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />
  }
  ,
  {
    path: "*",
    element: <Navigate to="/404" replace />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route element={<PrivateRoute roles={['admin']} />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="request-manage" element={<LogRequest />} />
            <Route path="setting" element={<Setting />} />
            <Route path="account-request" element={<AdminAccountRequests />} />
            <Route path="admin-account" element={<AdminAccount />} />
            <Route path="category" element={<Category />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute roles={['hr']} />}>
          <Route path="/hr" element={<MainLayout />}>

          </Route>
        </Route>

        <Route element={<PrivateRoute roles={['manager']} />}>
          <Route path="/manager" element={<MainLayout />}>

          </Route>
        </Route>

        <Route element={<PrivateRoute roles={['employee']} />}>
          <Route path="/employee" element={<MainLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
