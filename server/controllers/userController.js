import User from "../models/User.js";
export const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: "Employee" }).select("_id name email");
        res.status(200).json({ employees });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
