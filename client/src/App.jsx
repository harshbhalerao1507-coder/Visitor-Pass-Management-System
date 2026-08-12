import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Visitors from "./pages/Visitors";
import Appointments from "./pages/Appointments";
import PassManagement from "./pages/PassManagement";
import CheckLogs from "./pages/CheckLogs";
import ProtectedRoute from "./components/ProtectedRoute";
import RootRedirect from "./components/RootRedirect";
import AuthRoute from "./components/AuthRoute";
import NotAuthorized from "./pages/NotAuthorized";
import Reports from "./pages/Reports";
import QRScan from "./pages/QRScan";

import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route element={<AuthRoute />}>
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/unauthorized" element={<NotAuthorized />} />
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Employee", "Security"]} />}>
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/appointments" element={<Appointments/>} />
              <Route path="/reports" element={<Reports/>} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Security"]} />}>
              <Route path="/visitors" element={<Visitors/>} />
              <Route path="/passes" element={<PassManagement/>} />
              <Route path="/check-logs" element={<CheckLogs/>} />
              <Route path="/qr-scan" element={<QRScan />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
