import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AppointmentModal from "../components/AppointmentModal";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "./Appointments.css";
export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [visitors, setVisitors] = useState([]); 
    const [employees, setEmployees] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [deletingAppointment, setDeletingAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        fetchInitialData();
    }, []);
    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const [appRes, visRes, empRes] = await Promise.all([
                api.get("/appointment", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/visitors", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/users/employees", { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setAppointments(appRes.data.Appointments || []);
            setVisitors(visRes.data.visitors || []);
            setEmployees(empRes.data.employees || []);
        } catch (e) {
            const errorMsg = e.response?.data?.error || e.response?.data?.message || e.message || "Failed to fetch data";
            showNotification(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    const getAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/appointment", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data.Appointments || []);
        } catch (e) {
            const errorMsg = e.response?.data?.error || e.response?.data?.message || e.message || "Failed to fetch appointments";
            showNotification(errorMsg);
        }
    };
    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 3000);
    };
    const handleAddClick = () => {
        setEditingAppointment(null);
        setShowModal(true);
    };
    const handleEditClick = (app) => {
        setEditingAppointment(app);
        setShowModal(true);
    };
    const handleDeleteClick = (app) => {
        setDeletingAppointment(app);
    };
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/appointment/${deletingAppointment._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification("Appointment deleted successfully!");
            getAppointments();
            setDeletingAppointment(null);
        } catch (e) {
            const errorMsg = e.response?.data?.error || e.response?.data?.message || e.message || "Error deleting appointment";
            showNotification(errorMsg);
        } finally {
            setIsDeleting(false);
        }
    };
    const getVisitorName = (visitorId) => {
        const v = visitors.find(v => v._id === visitorId);
        return v ? v.name : "Unknown Visitor";
    };
    const getEmployeeName = (employeeId) => {
        const e = employees.find(e => e._id === employeeId);
        return e ? e.name : (employeeId || "Unknown Employee");
    };
    const filteredAppointments = appointments.filter(app => {
        const visName = getVisitorName(app.visitor).toLowerCase();
        const empName = getEmployeeName(app.employee).toLowerCase();
        return visName.includes(searchTerm.toLowerCase()) || 
               empName.includes(searchTerm.toLowerCase()) ||
               (app.purpose && app.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return (
        <>
            <Sidebar />
            <div className="dashboard-layout">
                {notification && <div className="notification-toast">{notification}</div>}
                <div className="page-header d-flex justify-between align-center">
                    <h1>Appointments</h1>
                    <button className="btn-primary" onClick={handleAddClick}>
                        <FaPlus className="icon-sm" /> Add Appointment
                    </button>
                </div>
                <div className="search-bar-container">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by Visitor, Employee, or Purpose..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Visitor</th>
                                <th>Employee</th>
                                <th>Purpose</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">Loading appointments...</td>
                                </tr>
                            ) : filteredAppointments.map((app) => (
                                <tr key={app._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{getVisitorName(app.visitor).charAt(0)}</div>
                                            <span className="user-name">{getVisitorName(app.visitor)}</span>
                                        </div>
                                    </td>
                                    <td>{getEmployeeName(app.employee)}</td>
                                    <td>{app.purpose}</td>
                                    <td>{app.visitDate ? app.visitDate.split("T")[0] : ""}</td>
                                    <td>{app.visitTime}</td>
                                    <td><span className={`status-badge status-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon text-blue" onClick={() => handleEditClick(app)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon text-red" onClick={() => handleDeleteClick(app)} title="Delete">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="empty-state">No appointments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {showModal &&
                    <AppointmentModal
                        editingAppointment={editingAppointment}
                        onClose={() => setShowModal(false)}
                        refreshAppointments={getAppointments}
                        onShowNotification={showNotification}
                    />
                }
                {deletingAppointment && (
                    <div className="modal-backdrop">
                        <div className="confirm-modal">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this appointment? This action cannot be undone.</p>
                            <div className="modal-footer" style={{ background: 'transparent', padding: '0', border: 'none', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button className="btn-secondary" onClick={() => setDeletingAppointment(null)} disabled={isDeleting}>Cancel</button>
                                <button className="btn-danger" onClick={confirmDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
