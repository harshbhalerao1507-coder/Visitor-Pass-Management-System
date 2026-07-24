import mongoose from "mongoose";
const checkLogSchema = new mongoose.Schema(
  {
    pass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pass",
      required: true,
    },
    visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor",
    required: true
    },
    checkIn: {
      type: Date,
      default: Date.now,
    },
    checkOut: {
      type: Date,
    },
    securityStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const CheckLog = mongoose.model("CheckLog", checkLogSchema);
export default CheckLog;
