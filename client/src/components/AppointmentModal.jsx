import { useState, useEffect } from "react";
import api from "../services/api";
import "./AppointmentModal.css";
import { FaTimes } from "react-icons/fa";
export default function AppointmentModal({ onClose, refreshAppointments, editingAppointment, onShowNotification }) {
    const [visitor, setVisitor] = useState("");
    const [employee, setEmployee] = useState("");
    const [purpose, setPurpose] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [status, setStatus] = useState("Pending");
    const [visitors, setVisitors] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [visRes, empRes] = await Promise.all([
                    api.get("/visitors", { headers: { Authorization: `Bearer ${token}` } }),
                    api.get("/users/employees", { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setVisitors(visRes.data.visitors);
                setEmployees(empRes.data.employees);
            } catch (err) {
                console.error("Failed to load data", err);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (editingAppointment) {
            const visitorId = typeof editingAppointment.visitor === "object" ? editingAppointment.visitor._id : editingAppointment.visitor;
            setVisitor(visitorId || "");
            setEmployee(editingAppointment.employee || "");
            setPurpose(editingAppointment.purpose || "");
            if (editingAppointment.visitDate) {
                const dateStr = editingAppointment.visitDate.includes("T") ? editingAppointment.visitDate.split("T")[0] : editingAppointment.visitDate;
                setVisitDate(dateStr);
            } else {
                setVisitDate("");
            }
            setVisitTime(editingAppointment.visitTime || "");
            setStatus(editingAppointment.status || "Pending");
        }
    }, [editingAppointment]);
    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const payload = { visitor, employee, purpose, visitDate, visitTime, status };
            if (editingAppointment) {
                await api.patch(`/appointment/${editingAppointment._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onShowNotification("Appointment updated successfully!");
            } else {
                await api.post("/appointment", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onShowNotification("Appointment added successfully!");
            }
            refreshAppointments();
            onClose();
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{editingAppointment ? "Edit Appointment" : "Add New Appointment"}</h2>
                    <button className="close-btn" onClick={onClose} disabled={loading}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Visitor</label>
                            <select value={visitor} onChange={(e) => setVisitor(e.target.value)} disabled={loading}>
                                <option value="">Select a Visitor</option>
                                {visitors.map(v => (
                                    <option key={v._id} value={v._id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Employee</label>
                            <select value={employee} onChange={(e) => setEmployee(e.target.value)} disabled={loading}>
                                <option value="">Select an Employee</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Purpose</label>
                        <input placeholder="Meeting, Interview, etc." value={purpose} onChange={(e) => setPurpose(e.target.value)} disabled={loading} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} disabled={loading} />
                        </div>
                        <div className="form-group">
                            <label>Time</label>
                            <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : (editingAppointment ? "Update Appointment" : "Save Appointment")}
                    </button>
                </div>
            </div>
        </div>
    );
}
