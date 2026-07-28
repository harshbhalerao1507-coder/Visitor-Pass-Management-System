import { useState } from "react";
import { registerUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css"
export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Employee");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await registerUser({
                name, email, password, role, phone, department
            });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
        } catch (e) {
            const errorMsg = e.response?.data?.error || e.response?.data?.message || e.message || "An error occurred";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div className="auth-header">
                    <h2>Create an account</h2>
                    <p>Enter your details to get started.</p>
                </div>
                {error && <div className="notification-toast error" style={{marginBottom: '1rem', color: 'White', textAlign: 'center'}}>{error}</div>}
                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                                <option value="Security">Security</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" placeholder="Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
                    </div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? "Signing up..." : "Sign up"}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/">Sign in</Link>
                </p>
            </div>
        </div>
    );
}