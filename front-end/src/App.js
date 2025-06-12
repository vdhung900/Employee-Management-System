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
            <Route index element={<AdminDashboard/>}/>
            <Route path="dashboard" element={<AdminDashboard/>}/>
            <Route path="request-manage" element={<LogRequest/>}/>
            <Route path="account" element={<AdminAccount/>}/>
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
