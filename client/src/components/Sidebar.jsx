import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import UserProfile from "./UserProfile";
import { FaHome, FaUsers, FaCalendarAlt, FaIdCard, FaPowerOff, FaQrcode, FaClipboardList } from "react-icons/fa";
export default function Sidebar() {
    const location = useLocation();
    let user = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error("Failed to parse user in sidebar", e);
        }
    }
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Visitor Pass</h2>
            </div>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                    <FaHome className="icon" /> Dashboard
                </Link>
                <Link to="/reports" className={location.pathname === "/reports" ? "active" : ""}>
                    <FaIdCard className="icon" /> Reports
                </Link>
                {user && ["Admin", "Security"].includes(user.role) && (
                    <Link to="/visitors" className={location.pathname === "/visitors" ? "active" : ""}>
                        <FaUsers className="icon" /> Visitors
                    </Link>
                )}
                <Link to="/appointments" className={location.pathname === "/appointments" ? "active" : ""}>
                    <FaCalendarAlt className="icon" /> Appointments
                </Link>
                {user && ["Admin", "Security"].includes(user.role) && (
                    <Link to="/passes" className={location.pathname === "/passes" ? "active" : ""}>
                        <FaIdCard className="icon" /> Passes
                    </Link>
                )}
                {user && ["Admin", "Security"].includes(user.role) && (
                    <Link to="/qr-scan" className={location.pathname === "/qr-scan" ? "active" : ""}>
                        <FaQrcode className="icon" /> QR Scanner
                    </Link>
                )}
                {user && ["Admin", "Security"].includes(user.role) && (
                    <Link to="/check-logs" className={location.pathname === "/check-logs" ? "active" : ""}>
                        <FaClipboardList className="icon" /> Check Logs
                    </Link>
                )}
            </nav>
            <div className="sidebar-footer">
                <UserProfile />
            </div>
        </div>
    );
}