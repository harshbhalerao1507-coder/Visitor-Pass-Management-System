import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScan }) => {
    const onScanRef = useRef(onScan);

    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250,
                },
            },
            false
        );

        let isScanning = true;

        const handleSuccess = (decodedText) => {
            if (isScanning) {
                console.log("QR Scanned:", decodedText);
                onScanRef.current(decodedText);
            }
        };

        const handleError = () => {
            // Ignore normal scanning errors
        };

        scanner.render(handleSuccess, handleError);

        return () => {
            isScanning = false;
            scanner.clear().catch((error) => {
                console.error("Failed to clear scanner:", error);
            });
        };
    }, []); // Empty dependency array ensures one initialization per mount

    return (
        <div>
            <h2>Scan Visitor Pass</h2>
            <div id="qr-reader"></div>
        </div>
    );
};

export default QRScanner;