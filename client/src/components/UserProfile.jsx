import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import api from "../services/api";
import "./UserProfile.css";
export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                }
            } else {
                try {
                    const token = localStorage.getItem("token");
                    if (token) {
                        const res = await api.get("/auth/me", {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.data && res.data.user) {
                            setUser(res.data.user);
                            localStorage.setItem("user", JSON.stringify(res.data.user));
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch user", e);
                }
            }
        };
        fetchUser();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    if (!user) return null; 
    const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U";
    return (
        <div className="user-profile-container" ref={dropdownRef}>
            <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="profile-avatar">
                    {initials}
                </div>
                <div className="profile-info">
                    <span className="profile-name">{user.name}</span>
                    <span className="profile-role">{user.role}</span>
                </div>
            </div>
            {isOpen && (
                <div className="profile-dropdown">
                    <div className="dropdown-header">
                        <div className="profile-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                            {initials}
                        </div>
                        <div className="dropdown-header-info">
                            <span className="dropdown-name">{user.name}</span>
                            {user.email && <span className="dropdown-email">{user.email}</span>}
                            <span className="dropdown-role">{user.role}</span>
                        </div>
                    </div>
                    <ul className="dropdown-menu">
                        <li className="dropdown-item logout" onClick={handleLogout}>
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
