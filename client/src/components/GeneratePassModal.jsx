import { useState, useEffect } from "react";
import api from "../services/api";
import "./GeneratePassModal.css";
import { FaTimes } from "react-icons/fa";
export default function GeneratePassModal({ onClose, refreshPasses, onShowNotification }) {
    const [appointment, setAppointment] = useState("");
    const [validFrom, setValidFrom] = useState("");
    const [validTo, setValidTo] = useState("");
    const [status, setStatus] = useState("Active");
    const [appointments, setAppointments] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchData = async () => {
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
            } catch (err) {
                console.error("Failed to load data", err);
                setError("Failed to load data for form");
            }
        };
        fetchData();
    }, []);
    const getVisitorName = (visitorId) => {
        const v = visitors.find(v => v._id === visitorId);
        return v ? v.name : "Unknown Visitor";
    };
    const getEmployeeName = (employeeId) => {
        const e = employees.find(e => e._id === employeeId);
        return e ? e.name : "Unknown Employee";
    };
    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            if (!appointment || !validFrom || !validTo) {
                throw new Error("Please fill all required fields");
            }
            const selectedApp = appointments.find(app => app._id === appointment);
            if (!selectedApp) {
                throw new Error("Invalid appointment selected");
            }
            const visitor = selectedApp.visitor;
            const passNumber = `PASS-${Math.floor(100000 + Math.random() * 900000)}`;
            const payload = { 
                visitor, 
                appointment, 
                passNumber, 
                validFrom, 
                validTo, 
                status 
            };
            const token = localStorage.getItem("token");
            await api.post("/passes", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onShowNotification("Pass generated successfully!");
            refreshPasses();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Generate Pass</h2>
                    <button className="close-btn" onClick={onClose} disabled={loading}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>Appointment</label>
                        <select value={appointment} onChange={(e) => setAppointment(e.target.value)} disabled={loading}>
                            <option value="">Select an Appointment</option>
                            {appointments.map(app => {
                                const visName = getVisitorName(app.visitor);
                                const empName = getEmployeeName(app.employee);
                                const dateStr = app.visitDate ? app.visitDate.split("T")[0] : "No Date";
                                return (
                                    <option key={app._id} value={app._id}>
                                        {visName} → {empName} ({dateStr})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Valid From</label>
                            <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} disabled={loading} />
                        </div>
                        <div className="form-group">
                            <label>Valid To</label>
                            <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                            <option value="Active">Active</option>
                            <option value="Expired">Expired</option>
                            <option value="Revoked">Revoked</option>
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Generating..." : "Generate Pass"}
                    </button>
                </div>
            </div>
        </div>
    );
}
