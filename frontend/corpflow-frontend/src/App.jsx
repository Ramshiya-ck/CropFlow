import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";

import EmployeeDashboard from "./pages/Employee/Dashboard";
import CreateRequest from "./pages/Employee/CreateRequest";
import MyRequests from "./pages/Employee/MyRequests";
import RequestDetail from "./pages/Employee/RequestDetail";

// import ManagerDashboard from "./pages/manager/ManagerDashboard";
// import PendingApprovals from "./pages/manager/PendingApprovals";
// import ApprovalDetail from "./pages/manager/ApprovalDetail";
// import RoleRoute from "./routes/RoleRoute";


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
                <Dashboard />
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

          {/* <Route
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
          /> */}

          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
