import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import PassDropdown from "../components/PassDropdown";
import "./CheckOut.css";
export default function CheckOut() {
    const [selectedPassId, setSelectedPassId] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const showNotification = (msg, isError = false) => {
        setNotification({ text: msg, isError });
        setTimeout(() => setNotification(""), 3000);
    };
    const handleCheckOut = async () => {
        if (!selectedPassId) {
            showNotification("Please select a pass", true);
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await api.post("/checklogs/checkout", { id: selectedPassId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification("Check-out successful!");
            setSelectedPassId("");
            setRefreshKey(prev => prev + 1); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Error during check-out";
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
                    <h1>Check Out</h1>
                </div>
                <div className="check-container">
                    <h2>Visitor Check Out</h2>
                    <PassDropdown
                        key={refreshKey}
                        statusFilter="Used"
                        value={selectedPassId}
                        onChange={setSelectedPassId}
                        disabled={loading}
                    />
                    <button 
                        className="btn-primary" 
                        onClick={handleCheckOut}
                        disabled={loading || !selectedPassId}
                        style={{ marginTop: '24px' }}
                    >
                        {loading ? "Checking out..." : "Check Out"}
                    </button>
                </div>
            </div>
        </>
    );
}
