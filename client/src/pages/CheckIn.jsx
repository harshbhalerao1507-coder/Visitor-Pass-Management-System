import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import PassDropdown from "../components/PassDropdown";
import "./CheckIn.css";
export default function CheckIn() {
    const [selectedPassId, setSelectedPassId] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const showNotification = (msg, isError = false) => {
        setNotification({ text: msg, isError });
        setTimeout(() => setNotification(""), 3000);
    };
    const handleCheckIn = async () => {
        if (!selectedPassId) {
            showNotification("Please select a pass", true);
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await api.post("/checklogs/checkin", { id: selectedPassId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification("Check-in successful!");
            setSelectedPassId("");
            setRefreshKey(prev => prev + 1); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Error during check-in";
            showNotification(errorMsg, true);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Sidebar />
            <div className="dashboard-layout">
                {notification && (
                    <div className={`notification-toast ${notification.isError ? "error" : ""}`}>
                        {notification.text}
                    </div>
                )}
                <div className="page-header">
                    <h1>Check In</h1>
                </div>
                <div className="check-container">
                    <h2>Visitor Check In</h2>
                    <PassDropdown
                        key={refreshKey}
                        statusFilter="Active"
                        value={selectedPassId}
                        onChange={setSelectedPassId}
                        disabled={loading}
                    />
                    <button 
                        className="btn-primary" 
                        onClick={handleCheckIn}
                        disabled={loading || !selectedPassId}
                        style={{ marginTop: '24px' }}
                    >
                        {loading ? "Checking in..." : "Check In"}
                    </button>
                </div>
            </div>
        </>
    );
}
