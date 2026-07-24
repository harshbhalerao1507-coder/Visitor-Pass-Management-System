import { useState } from "react";
import api from "../services/api";
import "../pages/PassManagement.css";
export default function DeletePassDialog({ pass, onClose, refreshPasses, onShowNotification }) {
    const [isDeleting, setIsDeleting] = useState(false);
    if (!pass) return null;
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/passes/${pass._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onShowNotification("Pass deleted successfully!");
            refreshPasses();
            onClose();
        } catch (e) {
            console.error(e);
            onShowNotification("Error deleting pass");
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div className="modal-backdrop">
            <div className="confirm-modal">
                <h3>Delete Pass?</h3>
                <p>Are you sure you want to delete this pass ({pass.passNumber})?</p>
                <div className="modal-footer" style={{ background: 'transparent', padding: '0', border: 'none', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button className="btn-secondary" onClick={onClose} disabled={isDeleting}>Cancel</button>
                    <button className="btn-danger" onClick={confirmDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
