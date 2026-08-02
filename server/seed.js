import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Visitor from "./models/Visitor.js";
import Appointment from "./models/Appointment.js";
import Pass from "./models/Pass.js";
import CheckLog from "./models/CheckLog.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");

        console.log("Deleting existing demo data...");
        await User.deleteMany();
        await Visitor.deleteMany();
        await Appointment.deleteMany();
        await Pass.deleteMany();
        await CheckLog.deleteMany();

        console.log("Creating users...");
        const adminHashedPassword = await bcrypt.hash("Admin@123", 10);
        const securityHashedPassword = await bcrypt.hash("Security@123", 10);
        const employeeHashedPassword = await bcrypt.hash("Employee@123", 10);

        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@demo.com",
            password: adminHashedPassword,
            role: "Admin"
        });

        const securityUser = await User.create({
            name: "Security User",
            email: "security@demo.com",
            password: securityHashedPassword,
            role: "Security"
        });

        const employee1 = await User.create({
            name: "Employee One",
            email: "employee1@demo.com",
            password: employeeHashedPassword,
            role: "Employee"
        });

        const employee2 = await User.create({
            name: "Employee Two",
            email: "employee2@demo.com",
            password: employeeHashedPassword,
            role: "Employee"
        });

        console.log("Creating visitors...");
        const visitorsData = [
            { name: "John Doe", email: "john@example.com", phone: "1234567890", address: "123 Main St", company: "Tech Corp", idProof: "Aadhar", photo: "placeholder.jpg" },
            { name: "Jane Smith", email: "jane@example.com", phone: "0987654321", address: "456 Oak Ave", company: "Innovate LLC", idProof: "PAN", photo: "placeholder.jpg" },
            { name: "Bob Johnson", email: "bob@example.com", phone: "1122334455", address: "789 Pine Rd", company: "Global Inc", idProof: "Passport", photo: "placeholder.jpg" },
            { name: "Alice Brown", email: "alice@example.com", phone: "5544332211", address: "321 Elm St", company: "Startup Hub", idProof: "Driver License", photo: "placeholder.jpg" },
            { name: "Charlie Davis", email: "charlie@example.com", phone: "6677889900", address: "654 Birch Blvd", company: "Dev Studio", idProof: "Aadhar", photo: "placeholder.jpg" }
        ];
        
        const createdVisitors = await Visitor.insertMany(visitorsData);

        console.log("Creating appointments...");
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const appointmentsData = [
            { visitor: createdVisitors[0]._id, employee: employee1._id, purpose: "Interview", visitDate: today, visitTime: "10:00 AM", status: "Approved" },
            { visitor: createdVisitors[1]._id, employee: employee2._id, purpose: "Meeting", visitDate: today, visitTime: "11:30 AM", status: "Pending" },
            { visitor: createdVisitors[2]._id, employee: employee1._id, purpose: "Vendor", visitDate: tomorrow, visitTime: "02:00 PM", status: "Rejected" },
            { visitor: createdVisitors[3]._id, employee: employee2._id, purpose: "Consultation", visitDate: today, visitTime: "04:00 PM", status: "Approved" },
            { visitor: createdVisitors[4]._id, employee: employee1._id, purpose: "Maintenance", visitDate: tomorrow, visitTime: "09:00 AM", status: "Approved" }
        ];

        const createdAppointments = await Appointment.insertMany(appointmentsData);

        console.log("Creating passes...");
        const createPassObj = (visitorId, appointmentId, status, passNumSuffix) => ({
            visitor: visitorId,
            appointment: appointmentId,
            passNumber: `PASS-${Date.now()}-${passNumSuffix}`,
            validFrom: today,
            validTo: tomorrow,
            status: status
        });

        const passesData = [
            createPassObj(createdVisitors[0]._id, createdAppointments[0]._id, "Active", "1"),
            createPassObj(createdVisitors[3]._id, createdAppointments[3]._id, "Expired", "2"),
            createPassObj(createdVisitors[4]._id, createdAppointments[4]._id, "Used", "3")
        ];

        const createdPasses = await Pass.insertMany(passesData);

        console.log("Creating check logs...");
        const checkLogsData = [
            { pass: createdPasses[0]._id, visitor: createdVisitors[0]._id, checkIn: new Date(today.setHours(9, 50, 0, 0)), securityStaff: securityUser._id },
            { pass: createdPasses[2]._id, visitor: createdVisitors[4]._id, checkIn: new Date(today.setHours(8, 45, 0, 0)), checkOut: new Date(today.setHours(10, 30, 0, 0)), securityStaff: securityUser._id }
        ];
        
        await CheckLog.insertMany(checkLogsData);

        console.log("Seed completed successfully.");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error with seeding:", err);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedData();
