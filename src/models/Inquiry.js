import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      default: null,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "In Progress",
        "Closed",
      ],
      default: "New",
      index: true,
    },

    source: {
      type: String,
      enum: [
        "Website",
        "WhatsApp",
        "Phone",
        "Other",
      ],
      default: "Website",
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry =
  mongoose.models.Inquiry ||
  mongoose.model("Inquiry", inquirySchema);

export default Inquiry;