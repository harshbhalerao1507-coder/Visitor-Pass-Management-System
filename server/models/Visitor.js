import mongoose from "mongoose";
const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    company: {
      type: String,
    },
    photo: {
      type: String,
    },
    idProof: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
