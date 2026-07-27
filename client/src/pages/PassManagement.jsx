import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import GeneratePassModal from "../components/GeneratePassModal";
import QRModal from "../components/QRModal";
import DeletePassDialog from "../components/DeletePassDialog";
import { FaPlus, FaTrash, FaSearch, FaQrcode, FaFilePdf } from "react-icons/fa";
import "./PassManagement.css";

export default function PassManagement() {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [notification, setNotification] = useState("");
    
    // Modal states
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedQRPass, setSelectedQRPass] = useState(null);
    const [deletingPass, setDeletingPass] = useState(null);

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/passes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPasses(res.data.passes || []);
        } catch (e) {
            console.error(e);
            showNotification("Failed to fetch passes", true);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (msg, isError = false) => {
        // Here we could support error styling by state, but since the CSS handles .error class optionally:
        setNotification({ text: msg, isError });
        setTimeout(() => setNotification(""), 3000);
    };

    const handleDownloadPDF = async (pass) => {
        if (!pass.pdfPath) {
            showNotification("PDF not available for this pass", true);
            return;
        }
        const baseUrl = api.defaults.baseURL.replace("/api", "");
        const pdfUrl = `${baseUrl}/${pass.pdfPath}`;
        window.open(pdfUrl, "_blank");
    };

    const filteredPasses = passes.filter(pass => {
        const passNumberMatch = pass.passNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const visitorMatch = pass.visitor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = pass.status?.toLowerCase().includes(searchTerm.toLowerCase());
        return passNumberMatch || visitorMatch || statusMatch;
    });

    return (
        <>
            <Sidebar />
            <div className="dashboard-layout">
                {notification && (
                    <div className={`notification-toast ${notification.isError ? "error" : ""}`}>
                        {notification.text}
                    </div>
                )}

                <div className="page-header d-flex justify-between align-center">
                    <h1>Pass Management</h1>
                    <button className="btn-primary" onClick={() => setShowGenerateModal(true)}>
                        <FaPlus className="icon-sm" /> Generate Pass
                    </button>
                </div>
                
                <div className="search-bar-container">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by Pass Number, Visitor Name, or Status..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Pass Number</th>
                                <th>Visitor</th>
                                <th>Appointment</th>
                                <th>Valid From</th>
                                <th>Valid To</th>
                                <th>Status</th>
                                <th>QR Code</th>
                                <th>PDF</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && passes.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="empty-state">Loading passes...</td>
                                </tr>
                            ) : filteredPasses.map((pass) => (
                                <tr key={pass._id}>
                                    <td><strong>{pass.passNumber}</strong></td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {pass.visitor?.name?.charAt(0) || "?"}
                                            </div>
                                            <span className="user-name">
                                                {pass.visitor?.name || "Unknown"}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{pass.appointment?.purpose || "N/A"}</td>
                                    <td>{pass.validFrom ? new Date(pass.validFrom).toLocaleDateString() : ""}</td>
                                    <td>{pass.validTo ? new Date(pass.validTo).toLocaleDateString() : ""}</td>
                                    <td>
                                        <span className={`status-badge status-${pass.status?.toLowerCase()}`}>
                                            {pass.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-icon text-blue" onClick={() => setSelectedQRPass(pass)} title="View QR">
                                            <FaQrcode />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn-icon text-gray" onClick={() => handleDownloadPDF(pass)} title="Download PDF">
                                            <FaFilePdf />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon text-red" onClick={() => setDeletingPass(pass)} title="Delete Pass">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredPasses.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="empty-state">No passes found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showGenerateModal &&
                    <GeneratePassModal
                        onClose={() => setShowGenerateModal(false)}
                        refreshPasses={fetchPasses}
                        onShowNotification={showNotification}
                    />
                }

                {selectedQRPass &&
                    <QRModal
                        pass={selectedQRPass}
                        onClose={() => setSelectedQRPass(null)}
                    />
                }

                {deletingPass && 
                    <DeletePassDialog
                        pass={deletingPass}
                        onClose={() => setDeletingPass(null)}
                        refreshPasses={fetchPasses}
                        onShowNotification={showNotification}
                    />
                }
            </div>
        </>
    )
}
