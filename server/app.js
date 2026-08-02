import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import visitorRoutes from "../server/routes/visitorRoutes.js"
import appointmentRoutes from "../server/routes/appointmentRoute.js"
import passRoutes from "./routes/passRoute.js";
import checkLogRoute from "../server/routes/checkLogRoute.js"
import dashboardRoute from "../server/routes/dashboardRoute.js"
import usersRoutes from "../server/routes/usersRoute.js"
import reportRoutes from "./routes/reportRoute.js";
import path from "path";
import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/pdfs", express.static("pdfs"));
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/visitors",visitorRoutes);
app.use("/api/appointment",appointmentRoutes)
app.use("/api/passes", passRoutes);
app.use("/api/checklogs", checkLogRoute);
app.use("/api/dashboard",dashboardRoute)
app.use("/api/users", usersRoutes)
app.use("/api/reports", reportRoutes);
export default app;
