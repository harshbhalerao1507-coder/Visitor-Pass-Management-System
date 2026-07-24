import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AddVisitorModal from "../components/AddVisitorModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./Visitors.css";
export default function Visitors(){
    const [visitors,setVisitors]=useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingVisitor, setEditingVisitor] = useState(null);
    const [deletingVisitor, setDeletingVisitor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState("");
    useEffect(()=>{
        getVisitors();
    },[]);
    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 3000);
    };
    const getVisitors=async()=>{
        setLoading(true);
        try {
            const token=localStorage.getItem("token");
            const res=await api.get("/visitors",{
                headers:{ Authorization:`Bearer ${token}` }
            });
            setVisitors(res.data.visitors);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    const handleAddClick = () => {
        setEditingVisitor(null);
        setShowModal(true);
    };
    const handleEditClick = (visitor) => {
        setEditingVisitor(visitor);
        setShowModal(true);
    };
    const handleDeleteClick = (visitor) => {
        setDeletingVisitor(visitor);
    };
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/visitors/${deletingVisitor._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification("Visitor deleted successfully!");
            getVisitors();
            setDeletingVisitor(null);
        } catch (e) {
            console.log(e);
            showNotification("Error deleting visitor");
        } finally {
            setIsDeleting(false);
        }
    };
    return(
        <>
            <Sidebar/>
            <div className="dashboard-layout">
                {notification && <div className="notification-toast">{notification}</div>}
                <div className="page-header d-flex justify-between align-center">
                    <h1>Visitors</h1>
                    <button className="btn-primary" onClick={handleAddClick}>
                        <FaPlus className="icon-sm" /> Add Visitor
                    </button>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && visitors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">Loading visitors...</td>
                                </tr>
                            ) : visitors.map((visitor)=>(
                                <tr key={visitor._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{visitor.name.charAt(0)}</div>
                                            <span className="user-name">{visitor.name}</span>
                                        </div>
                                    </td>
                                    <td>{visitor.email}</td>
                                    <td>{visitor.phone}</td>
                                    <td><span className="badge">{visitor.company}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon text-blue" onClick={() => handleEditClick(visitor)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon text-red" onClick={() => handleDeleteClick(visitor)} title="Delete">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && visitors.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-state">No visitors found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {showModal &&
                    <AddVisitorModal
                        editingVisitor={editingVisitor}
                        onClose={() => setShowModal(false)}
                        refreshVisitors={getVisitors}
                        onShowNotification={showNotification}
                    />
                }
                {deletingVisitor && (
                    <div className="modal-backdrop">
                        <div className="confirm-modal">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete {deletingVisitor.name}? This action cannot be undone.</p>
                            <div className="modal-footer" style={{ background: 'transparent', padding: '0', border: 'none', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button className="btn-secondary" onClick={() => setDeletingVisitor(null)} disabled={isDeleting}>Cancel</button>
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