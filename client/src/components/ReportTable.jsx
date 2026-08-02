export default function ReportTable({ data, sortConfig, setSortConfig }) {
    
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString();
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return ' ↕';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="report-table-container">
            {data.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No records found matching filters.</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th onClick={() => handleSort('visitorName')}>Name {getSortIcon('visitorName')}</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th onClick={() => handleSort('company')}>Company {getSortIcon('company')}</th>
                            <th>Host</th>
                            <th onClick={() => handleSort('appointmentDate')}>Appointment Date {getSortIcon('appointmentDate')}</th>
                            <th>Pass Number</th>
                            <th onClick={() => handleSort('passStatus')}>Pass Status {getSortIcon('passStatus')}</th>
                            <th onClick={() => handleSort('checkIn')}>Check-In {getSortIcon('checkIn')}</th>
                            <th onClick={() => handleSort('checkOut')}>Check-Out {getSortIcon('checkOut')}</th>
                            <th onClick={() => handleSort('createdDate')}>Created {getSortIcon('createdDate')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row._id}>
                                <td>
                                    {row.visitor && row.visitor.photo ? (
                                        <img src={`http://localhost:5000/uploads/${row.visitor.photo}`} alt="Visitor" className="visitor-photo" />
                                    ) : (
                                        <div className="visitor-photo" style={{ backgroundColor: '#ccc' }}></div>
                                    )}
                                </td>
                                <td>{row.visitor ? row.visitor.name : "-"}</td>
                                <td>{row.visitor ? row.visitor.email : "-"}</td>
                                <td>{row.visitor ? row.visitor.phone : "-"}</td>
                                <td>{row.visitor && row.visitor.company ? row.visitor.company : "-"}</td>
                                <td>{row.employee ? row.employee.name : "-"}</td>
                                <td>{row.appointmentDate ? new Date(row.appointmentDate).toLocaleDateString() : "-"} {row.appointmentTime}</td>
                                <td>{row.passNumber}</td>
                                <td>{row.passStatus}</td>
                                <td>{formatDate(row.checkIn)}</td>
                                <td>{formatDate(row.checkOut)}</td>
                                <td>{formatDate(row.createdDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
