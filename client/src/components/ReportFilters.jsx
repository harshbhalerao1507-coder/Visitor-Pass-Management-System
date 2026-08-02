export default function ReportFilters({ filters, setFilters, uniqueEmployees, uniqueCompanies }) {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="report-filters">
            <div className="filter-group">
                <label>Search</label>
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Name, Email, Phone, Pass..." 
                    value={filters.search} 
                    onChange={handleFilterChange} 
                />
            </div>
            
            <div className="filter-group">
                <label>Start Date</label>
                <input 
                    type="date" 
                    name="startDate" 
                    value={filters.startDate} 
                    onChange={handleFilterChange} 
                />
            </div>
            
            <div className="filter-group">
                <label>End Date</label>
                <input 
                    type="date" 
                    name="endDate" 
                    value={filters.endDate} 
                    onChange={handleFilterChange} 
                />
            </div>

            <div className="filter-group">
                <label>Appointment Status</label>
                <select name="appointmentStatus" value={filters.appointmentStatus} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Pass Status</label>
                <select name="passStatus" value={filters.passStatus} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Used">Used</option>
                    <option value="Revoked">Revoked</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Check Status</label>
                <select name="checkStatus" value={filters.checkStatus} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Not Visited">Not Visited</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Employee</label>
                <select name="employee" value={filters.employee} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    {uniqueEmployees.map(emp => (
                        <option key={emp} value={emp}>{emp}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Company</label>
                <select name="company" value={filters.company} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    {uniqueCompanies.map(comp => (
                        <option key={comp} value={comp}>{comp}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
