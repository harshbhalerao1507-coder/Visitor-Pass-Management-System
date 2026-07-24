import "./QRModal.css";
import { FaTimes } from "react-icons/fa";
export default function QRModal({ pass, onClose }) {
    if (!pass) return null;
    const qrImage = pass.qrCode;
    return (
        <div className="modal-backdrop">
            <div className="modal-content qr-modal">
                <div className="modal-header">
                    <h2>Pass QR Code</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body qr-body">
                    <div className="qr-info">
                        <p><strong>Pass Number:</strong> {pass.passNumber}</p>
                        <p><strong>Visitor:</strong> {pass.visitor?.name || "Unknown Visitor"}</p>
                    </div>
                    {qrImage ? (
                        <img src={qrImage} alt={`QR Code for ${pass.passNumber}`} className="qr-image" />
                    ) : (
                        <div className="error-message" style={{ width: '100%', boxSizing: 'border-box' }}>
                            No QR code available for this pass.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
