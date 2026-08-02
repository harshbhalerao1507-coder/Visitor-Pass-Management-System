import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ReportStats from "../components/ReportStats";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";
import "./Reports.css";

export default function Reports() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        startDate: "",
        endDate: "",
        appointmentStatus: "All",
        passStatus: "All",
        checkStatus: "All",
        employee: "All",
        company: "All"
    });

    const [sortConfig, setSortConfig] = useState({
        key: 'createdDate',
        direction: 'desc'
    });

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/reports", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!res.ok) {
                    throw new Error("Failed to fetch reports");
                }

                const result = await res.json();
                setData(result.reports || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    useEffect(() => {
        let result = [...data];

        // Apply Search
        if (filters.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(row => 
                (row.visitor?.name && row.visitor.name.toLowerCase().includes(query)) ||
                (row.visitor?.email && row.visitor.email.toLowerCase().includes(query)) ||
                (row.visitor?.phone && row.visitor.phone.toLowerCase().includes(query)) ||
                (row.visitor?.company && row.visitor.company.toLowerCase().includes(query)) ||
                (row.employee?.name && row.employee.name.toLowerCase().includes(query)) ||
                (row.passNumber && row.passNumber.toLowerCase().includes(query))
            );
        }

        // Apply Date Range
        if (filters.startDate) {
            result = result.filter(row => new Date(row.appointmentDate) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            // Include entire end date
            const end = new Date(filters.endDate);
            end.setDate(end.getDate() + 1);
            result = result.filter(row => new Date(row.appointmentDate) < end);
        }

        // Apply Status Filters
        if (filters.appointmentStatus !== "All") {
            result = result.filter(row => row.appointmentStatus === filters.appointmentStatus);
        }
        if (filters.passStatus !== "All") {
            result = result.filter(row => row.passStatus === filters.passStatus);
        }
        if (filters.checkStatus !== "All") {
            if (filters.checkStatus === "Checked In") {
                result = result.filter(row => row.checkIn && !row.checkOut);
            } else if (filters.checkStatus === "Checked Out") {
                result = result.filter(row => row.checkIn && row.checkOut);
            } else if (filters.checkStatus === "Not Visited") {
                result = result.filter(row => !row.checkIn);
            }
        }

        // Apply Employee and Company Filters
        if (filters.employee !== "All") {
            result = result.filter(row => row.employee?.name === filters.employee);
        }
        if (filters.company !== "All") {
            result = result.filter(row => row.visitor?.company === filters.company);
        }

        // Apply Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle nested object sorting
                if (sortConfig.key === 'visitorName') {
                    aVal = a.visitor?.name || "";
                    bVal = b.visitor?.name || "";
                } else if (sortConfig.key === 'company') {
                    aVal = a.visitor?.company || "";
                    bVal = b.visitor?.company || "";
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredData(result);
    }, [data, filters, sortConfig]);

    const handleExportCSV = () => {
        const exportData = filteredData.map(row => ({
            "Visitor Name": row.visitor?.name || "-",
            "Email": row.visitor?.email || "-",
            "Phone": row.visitor?.phone || "-",
            "Company": row.visitor?.company || "-",
            "Host": row.employee?.name || "-",
            "Appointment Date": row.appointmentDate ? new Date(row.appointmentDate).toLocaleDateString() : "-",
            "Pass Number": row.passNumber,
            "Pass Status": row.passStatus,
            "Check-In": row.checkIn ? new Date(row.checkIn).toLocaleString() : "-",
            "Check-Out": row.checkOut ? new Date(row.checkOut).toLocaleString() : "-",
            "Created Date": row.createdDate ? new Date(row.createdDate).toLocaleString() : "-"
        }));
        exportToCSV(exportData, "Visitor_Reports");
    };

    const handleExportExcel = () => {
        const exportData = filteredData.map(row => ({
            "Visitor Name": row.visitor?.name || "-",
            "Email": row.visitor?.email || "-",
            "Phone": row.visitor?.phone || "-",
            "Company": row.visitor?.company || "-",
            "Host": row.employee?.name || "-",
            "Appointment Date": row.appointmentDate ? new Date(row.appointmentDate).toLocaleDateString() : "-",
            "Pass Number": row.passNumber,
            "Pass Status": row.passStatus,
            "Check-In": row.checkIn ? new Date(row.checkIn).toLocaleString() : "-",
            "Check-Out": row.checkOut ? new Date(row.checkOut).toLocaleString() : "-",
            "Created Date": row.createdDate ? new Date(row.createdDate).toLocaleString() : "-"
        }));
        exportToExcel(exportData, "Visitor_Reports");
    };

    const uniqueEmployees = [...new Set(data.filter(d => d.employee).map(d => d.employee.name))];
    const uniqueCompanies = [...new Set(data.filter(d => d.visitor && d.visitor.company).map(d => d.visitor.company))];

    return (
        <>
            <Sidebar />
            <div className="reports-layout">
                <div className="reports-container">
                    <div className="reports-header">
                        <h1>Dashboard Reports</h1>
                        <div className="export-buttons">
                            <button className="btn-export csv" onClick={handleExportCSV}>Export CSV</button>
                            <button className="btn-export excel" onClick={handleExportExcel}>Export Excel</button>
                        </div>
                    </div>

                    {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
                    
                    {loading ? (
                        <div>Loading report data...</div>
                    ) : (
                        <>
                            <ReportStats data={filteredData} />
                            
                            <ReportFilters 
                                filters={filters} 
                                setFilters={setFilters} 
                                uniqueEmployees={uniqueEmployees}
                                uniqueCompanies={uniqueCompanies}
                            />
                            
                            <ReportTable 
                                data={filteredData} 
                                sortConfig={sortConfig}
                                setSortConfig={setSortConfig}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
