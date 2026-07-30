import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import sendEmail from "./utils/sendEmail.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`);  
});