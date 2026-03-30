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
import History from "./pages/Employee/History";
import UploadedBills from "./pages/Employee/UploadedBills";
import FinanceDashboard from "./pages/Finance/Dashboard";
import ITDashboard from "./pages/IT/Dashboard";
import HRDashboard from "./pages/HR/Dashboard";


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
            path="/employee/status"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/bills"
            element={
              <ProtectedRoute>
                <UploadedBills />
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

          <Route
            path="/finance"
            element={
              <RoleRoute role="finance">
                <FinanceDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/it"
            element={
              <RoleRoute role="it">
                <ITDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/hr"
            element={
              <RoleRoute role="hr">
                <HRDashboard />
              </RoleRoute>
            }
          />

          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
