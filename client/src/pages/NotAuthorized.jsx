import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
export default function NotAuthorized() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#f9fafb',
            color: '#111827',
            textAlign: 'center',
            padding: '20px'
        }}>
            <FaLock style={{ fontSize: '64px', color: '#ef4444', marginBottom: '24px' }} />
            <h1 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 'bold' }}>Access Denied</h1>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '32px', maxWidth: '400px' }}>
                You do not have permission to view this page. If you believe this is an error, please contact your administrator.
            </p>
            <Link to="/dashboard" style={{
                background: '#4f46e5',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background 0.2s'
            }}>
                Return to Dashboard
            </Link>
        </div>
    );
}
