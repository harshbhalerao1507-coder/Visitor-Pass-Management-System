import mongoose from "mongoose";
const passSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    passNumber: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
    },
    pdfPath: {
      type: String,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Used", "Expired", "Revoked"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);
const Pass = mongoose.model("Pass", passSchema);
export default Pass;
