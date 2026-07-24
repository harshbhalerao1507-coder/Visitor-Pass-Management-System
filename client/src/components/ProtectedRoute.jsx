import { Navigate, Outlet } from "react-router-dom";
export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;
    try {
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
    }
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
}
