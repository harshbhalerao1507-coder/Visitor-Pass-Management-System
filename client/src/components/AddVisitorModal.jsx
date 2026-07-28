import { useState, useEffect } from "react";
import api from "../services/api";
import "./AddVisitorModal.css";
import { FaTimes } from "react-icons/fa";
export default function AddVisitorModal({ onClose, refreshVisitors, editingVisitor, onShowNotification }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState("");
    const [company, setCompany] = useState("");
    const [photo, setPhoto] = useState("");
    const [idProof, setIdProof] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (editingVisitor) {
            setName(editingVisitor.name || "");
            setEmail(editingVisitor.email || "");
            setPhone(editingVisitor.phone || "");
            setAddress(editingVisitor.address || "");
            setCompany(editingVisitor.company || "");
            setPhoto(editingVisitor.photo || "");
            setIdProof(editingVisitor.idProof || "");
        }
    }, [editingVisitor]);
    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("address", address);
            formData.append("company", company);
            formData.append("idProof", idProof);

            if (photo) {
                formData.append("photo", photo);
            }
            if (editingVisitor) {
                await api.patch(`/visitors/${editingVisitor._id}`,formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onShowNotification("Visitor updated successfully!");
            } else {
                await api.post("/visitors", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onShowNotification("Visitor added successfully!");
            }
            refreshVisitors();
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "An error occurred";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{editingVisitor ? "Edit Visitor" : "Add New Visitor"}</h2>
                    <button className="close-btn" onClick={onClose} disabled={loading}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                        </div>
                        <div className="form-group">
                            <label>Company</label>
                            <input placeholder="Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input placeholder="123 Main St, City" value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Visitor Photo</label>
                            {editingVisitor && editingVisitor.photo && typeof photo === 'string' && (
                                <div style={{ marginBottom: '10px' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL.replace("/api","")}/uploads/${editingVisitor.photo}`} 
                                        alt="Current" 
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Proof Number</label>
                            <input placeholder="Passport / DL Number" value={idProof} onChange={(e) => setIdProof(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : (editingVisitor ? "Update Visitor" : "Save Visitor")}
                    </button>
                </div>
            </div>
        </div>
    );
}