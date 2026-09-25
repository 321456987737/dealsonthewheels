import mongoose from "mongoose";

const testDriveSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
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

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Phone",
        "WhatsApp",
        "Other",
      ],
      default: "Website",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same vehicle from having
// multiple active requests for the same date/time.
testDriveSchema.index({
  carId: 1,
  date: 1,
  time: 1,
});

const TestDrive =
  mongoose.models.TestDrive ||
  mongoose.model("TestDrive", testDriveSchema);

export default TestDrive;
// import mongoose from "mongoose";

// const testDriveSchema = new mongoose.Schema(
//   {
//     businessId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Business",
//       required: true,
//       index: true,
//     },

//     carId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Car",
//       required: true,
//       index: true,
//     },

//     customerName: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 100,
//     },

//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 30,
//     },

//     email: {
//       type: String,
//       default: "",
//       trim: true,
//       lowercase: true,
//       maxlength: 150,
//     },

//     date: {
//       type: String,
//       required: true,
//     },

//     time: {
//       type: String,
//       required: true,
//     },

//     message: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 1000,
//     },

//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Confirmed",
//         "Completed",
//         "Cancelled",
//       ],
//       default: "Pending",
//       index: true,
//     },

//     source: {
//       type: String,
//       enum: ["Website", "Phone", "WhatsApp", "Other"],
//       default: "Website",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// testDriveSchema.index({
//   businessId: 1,
//   date: 1,
//   time: 1,
// });

// const TestDrive =
//   mongoose.models.TestDrive ||
//   mongoose.model("TestDrive", testDriveSchema);

// export default TestDrive;