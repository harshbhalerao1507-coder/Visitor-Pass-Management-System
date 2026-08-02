export default function ReportStats({ data }) {
    // Calculate stats
    const totalVisitors = new Set(data.filter(d => d.visitor).map(d => d.visitor._id)).size;
    const todayStr = new Date().toISOString().split("T")[0];

    const todaysVisitors = new Set(
        data.filter(d => d.visitor && d.checkIn && d.checkIn.startsWith(todayStr))
            .map(d => d.visitor._id)
    ).size;

    const approvedAppointments = data.filter(d => d.appointmentStatus === "Approved").length;
    const pendingApprovals = data.filter(d => d.appointmentStatus === "Pending").length;
    const activePasses = data.filter(d => d.passStatus === "Active").length;
    const expiredPasses = data.filter(d => d.passStatus === "Expired").length;

    const todaysCheckIns = data.filter(d => d.checkIn && d.checkIn.startsWith(todayStr)).length;
    const todaysCheckOuts = data.filter(d => d.checkOut && d.checkOut.startsWith(todayStr)).length;

    return (
        <div className="report-stats">
            <div className="stat-card">
                <h3>Total Visitors</h3>
                <p>{totalVisitors}</p>
            </div>
            <div className="stat-card">
                <h3>Today's Visitors</h3>
                <p>{todaysVisitors}</p>
            </div>
            <div className="stat-card">
                <h3>Approved Appointments</h3>
                <p>{approvedAppointments}</p>
            </div>
            <div className="stat-card">
                <h3>Pending Approvals</h3>
                <p>{pendingApprovals}</p>
            </div>
            <div className="stat-card">
                <h3>Active Passes</h3>
                <p>{activePasses}</p>
            </div>
            <div className="stat-card">
                <h3>Expired Passes</h3>
                <p>{expiredPasses}</p>
            </div>
            <div className="stat-card">
                <h3>Today's Check-Ins</h3>
                <p>{todaysCheckIns}</p>
            </div>
            <div className="stat-card">
                <h3>Today's Check-Outs</h3>
                <p>{todaysCheckOuts}</p>
            </div>
        </div>
    );
}
