import { useState } from "react";
import QRScanner from "../components/QRScanner";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaIdCard, FaUser, FaCheck, FaCamera } from "react-icons/fa";
import "./QRScan.css";

const QRScan = () => {
    const [pass, setPass] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [scanActive, setScanActive] = useState(true);

    const handleScan = async (passId) => {
        if (!scanActive) return;

        try {
            setLoading(true);
            setError("");
            setMessage("");
            setPass(null);
            setScanActive(false);

            const token = localStorage.getItem("token");

            const response = await api.get(`/passes/${passId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPass(response.data.pass);
            setMessage("Pass scanned successfully");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setScanActive(true);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Visitor pass not found."
            );
            setTimeout(() => setError(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            setActionLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/checklogs/checkin",
                {
                    id: pass._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message || "Check-in successful");
            setTimeout(() => setMessage(""), 3000);

            // Update the displayed pass status
            setPass((prev) => ({
                ...prev,
                status: "Used",
            }));

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Check-in failed."
            );
            setTimeout(() => setError(""), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setActionLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/checklogs/checkout",
                {
                    id: pass._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message || "Check-out successful");
            setTimeout(() => setMessage(""), 3000);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Check-out failed."
            );
            setTimeout(() => setError(""), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const scanAnother = () => {
    setScanActive(false);
    setPass(null);
    setError("");
    setMessage("");

    setTimeout(() => {
        setScanActive(true);
    }, 500);
};

    return (
        <>
            <Sidebar />
            <div className="dashboard-layout qr-layout">
                {message && (
                    <div className="notification-toast" style={{background: '#10b981', color: 'white'}}>
                        {message}
                    </div>
                )}
                {error && (
                    <div className="notification-toast error" style={{background: '#ef4444', color: 'white'}}>
                        {error}
                    </div>
                )}
                
                <div className="page-header">
                    <h1>QR Scanner</h1>
                    <p className="text-gray" style={{marginTop: '0.5rem'}}>Scan a visitor's QR pass to verify their identity and manage check-in/check-out.</p>
                </div>

                <div className="qr-container">
                    <div className="qr-scanner-section card">
                        <div className="card-header">
                            <h3>Camera Scanner</h3>
                            <FaCamera className="card-icon text-blue" />
                        </div>
                        <div className="scanner-wrapper">
                            {scanActive ? (
                                <>
                                    <p className="scan-status-text">Ready to scan. Point the camera at the QR code on the visitor pass.</p>
                                    <QRScanner onScan={handleScan} />
                                </>
                            ) : (
                                <div className="scanner-paused">
                                    {loading ? (
                                        <p className="loading-text">Finding visitor pass...</p>
                                    ) : (
                                        <>
                                            <FaCheck className="success-icon" />
                                            <p>Scan complete</p>
                                            <button className="btn-secondary mt-1" onClick={scanAnother}>
                                                Scan Another Pass
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="qr-details-section">
                        {!pass && !loading && (
                            <div className="empty-state-card card">
                                <p>Waiting for scan...</p>
                            </div>
                        )}

                        {pass && (
                            <div className="details-cards">
                                <div className="card">
                                    <div className="card-header">
                                        <h3>Visitor Details</h3>
                                        <FaUser className="card-icon text-purple" />
                                    </div>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Name</span>
                                            <span className="detail-value">{pass.visitor?.name || "N/A"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Email</span>
                                            <span className="detail-value">{pass.visitor?.email || "N/A"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone</span>
                                            <span className="detail-value">{pass.visitor?.phone || "N/A"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Company</span>
                                            <span className="detail-value">{pass.visitor?.company || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <h3>Pass Details</h3>
                                        <FaIdCard className="card-icon text-indigo" />
                                    </div>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Pass Number</span>
                                            <span className="detail-value font-bold">{pass.passNumber}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Status</span>
                                            <span className={`status-badge status-${pass.status?.toLowerCase()}`}>
                                                {pass.status}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Valid From</span>
                                            <span className="detail-value">{new Date(pass.validFrom).toLocaleString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Valid To</span>
                                            <span className="detail-value">{new Date(pass.validTo).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="action-buttons-container mt-2">
                                        {pass.status === "Active" && (
                                            <button
                                                className="btn-primary w-100"
                                                onClick={handleCheckIn}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Processing..." : "Check In"}
                                            </button>
                                        )}

                                        {pass.status === "Used" && (
                                            <button
                                                className="btn-warning w-100"
                                                onClick={handleCheckOut}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Processing..." : "Check Out"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QRScan;