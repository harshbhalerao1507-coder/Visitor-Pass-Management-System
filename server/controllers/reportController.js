import Appointment from "../models/Appointment.js";
import Pass from "../models/Pass.js";
import CheckLog from "../models/CheckLog.js";
import Visitor from "../models/Visitor.js";

export const getReportsData = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate("visitor")
            .populate("employee");
            
        const passes = await Pass.find({});
        const passMap = {};
        passes.forEach(p => passMap[p.appointment.toString()] = p);
        
        const checkLogs = await CheckLog.find({});
        const checkLogMap = {};
        checkLogs.forEach(log => checkLogMap[log.pass.toString()] = log);
        
        const reportData = appointments.map(app => {
            const pass = passMap[app._id.toString()];
            const log = pass ? checkLogMap[pass._id.toString()] : null;
            
            return {
                _id: app._id,
                visitor: app.visitor,
                employee: app.employee,
                appointmentDate: app.visitDate,
                appointmentTime: app.visitTime,
                appointmentStatus: app.status,
                passNumber: pass ? pass.passNumber : "-",
                passStatus: pass ? pass.status : "-",
                passId: pass ? pass._id : null,
                checkIn: log ? log.checkIn : null,
                checkOut: log ? log.checkOut : null,
                createdDate: app.createdAt
            };
        });
        
        res.status(200).json({ reports: reportData });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
};
