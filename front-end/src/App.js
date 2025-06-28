import React from "react";
import "./assets/styles/global.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicRoute from "./components/auth/PublicRoute";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import EmployeeDashboard from "./pages/employee/Dashboard";
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
import {LoadingProvider} from "./contexts/LoadingContext";
import Roles from "./pages/admin/Roles";
import Permission from "./pages/admin/Permission";
import Error403Page from "./pages/Forbidden";
import Benefits from './pages/employee/Benefits';
import ApproveRequest from "./pages/employee/ApproveRequest";
import EmployeeReviewResult from "./pages/employee/EmployeeReviewResult";
import DocumentManagement from "./pages/employee/DocumentManagement";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/404",
      element: (
          <NotFound />
      ),
    },
    {
      path: "/403",
      element: (
          <Error403Page />
      ),
    },
    {
      path: "/admin",
      element: <PrivateRoute />,
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
            { path: "roles", element: <Roles /> },
            { path: "permissions", element: <Permission /> },
          ],
        },
      ],
    },
    {
      path: "/employee",
      element: <PrivateRoute />,
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
            { path: "reports", element: <Reports /> },
            { path: "requests", element: <Requests /> },
            { path: "staff-management", element: <StaffManagement /> },
            { path: "team-management", element: <TeamManagement /> },
            { path: "team-performance", element: <TeamPerformance /> },
            { path: "benefits", element: <Benefits /> },
            { path: "approve-request", element: <ApproveRequest /> },
            { path: "review", element: <EmployeeReviewResult /> },
            { path: "documents", element: <DocumentManagement /> },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );

}

export default App;