import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "./PassManagement.css"; // Reuse existing table styles

export default function CheckLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await api.get("/checklogs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data.checkLogs || []);
        } catch (e) {
            setError(e.response?.data?.error || e.response?.data?.message || "Unable to load check logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sidebar />
            <div className="dashboard-layout">
                <div className="page-header">
                    <h1>Check Logs</h1>
                </div>

                {error && (
                    <div className="notification-toast error" style={{background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px', position: 'fixed', top: '20px', right: '20px', zIndex: 1000}}>
                        {error}
                    </div>
                )}

                <div className="table-container" style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Visitor Name</th>
                                <th>Company</th>
                                <th>Pass Number</th>
                                <th>Check-In Time</th>
                                <th>Check-Out Time</th>
                                <th>Security Staff</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">Loading check logs...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">No check-in records found.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>{log.visitor?.name || "N/A"}</td>
                                        <td>{log.visitor?.company || "N/A"}</td>
                                        <td><strong>{log.pass?.passNumber || "N/A"}</strong></td>
                                        <td>{log.checkIn ? new Date(log.checkIn).toLocaleString() : "N/A"}</td>
                                        <td>{log.checkOut ? new Date(log.checkOut).toLocaleString() : "Not checked out"}</td>
                                        <td>{log.securityStaff?.name || "N/A"}</td>
                                        <td>
                                            <span className={`status-badge status-${log.checkOut ? 'used' : 'active'}`}>
                                                {log.checkOut ? "Checked Out" : "Checked In"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
