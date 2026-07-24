import { useState, useEffect } from "react";
import api from "../services/api";
export default function PassDropdown({ statusFilter, value, onChange, disabled }) {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fetchPasses = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/passes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            let fetchedPasses = res.data.passes || [];
            if (statusFilter) {
                fetchedPasses = fetchedPasses.filter(p => p.status === statusFilter);
            }
            setPasses(fetchedPasses);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch passes");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPasses();
    }, [statusFilter]);
    return (
        <div className="form-group" style={{ marginBottom: 0 }}>
            {error && <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{error}</div>}
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                disabled={disabled || loading}
                className="search-input" 
                style={{ width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px" }}
            >
                <option value="">{loading ? "Loading passes..." : "Select a Pass"}</option>
                {passes.map(pass => (
                    <option key={pass._id} value={pass._id}>
                        {pass.passNumber} | {pass.visitor?.name || "Unknown Visitor"}
                    </option>
                ))}
            </select>
        </div>
    );
}
