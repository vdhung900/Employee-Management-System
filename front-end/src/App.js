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
import Setting from "./pages/admin/Setting";
import AdminAccountRequests from "./pages/admin/AdminAccountRequests";
import Requests from "./pages/hr/Request";

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
          { path: "account-request", element: <AdminAccountRequests /> }
        ]
      }
    ]
  },
  {
    path: "/hr",
    element: <PrivateRoute roles={['hr']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "request", element: <Requests /> }
        ]
      }
    ]
  },
  {
    path: "/manager",
    element: <PrivateRoute roles={['manager']} />,
    children: [
      {
        element: <MainLayout />,
        children: []
      }
    ]
  },
  {
    path: "/employee",
    element: <PrivateRoute roles={['employee']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <EmployeeDashboard /> },
          { path: "dashboard", element: <EmployeeDashboard /> }
        ]
      }
    ]
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
