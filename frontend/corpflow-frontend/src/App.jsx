import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
import EmployeeDashboard from "./pages/Employee/Dashboard";
import CreateRequest from "./pages/Employee/CreateRequest";
import MyRequests from "./pages/Employee/MyRequests";
import RequestDetail from "./pages/Employee/RequestDetail";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import PendingApprovals from "./pages/manager/ PendingApprovals.jsx";
import ApprovalDetail from "./pages/manager/ApprovalDetail";
import RoleRoute from "./routes/RoleRoute";
import AdminDashboard from "./pages/Admin/Dashboard";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/create"
            element={
              <ProtectedRoute>
                <CreateRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <RoleRoute role="manager">
                <ManagerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/manager/pending"
            element={
              <RoleRoute role="manager">
                <PendingApprovals />
              </RoleRoute>
            }
          />

          <Route
            path="/manager/approvals/:id"
            element={
              <RoleRoute role="manager">
                <ApprovalDetail />
              </RoleRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            }
          />

          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
