import mongoose from "mongoose";
const carImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    alt: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const carSchema = new mongoose.Schema(
  {
    stockNumber: {
      type: String,
      trim: true,
      // unique: true,
      sparse: true,
    },

    make: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },

    mileageUnit: {
      type: String,
      enum: ["km", "miles"],
      default: "km",
    },

    transmission: {
      type: String,
      enum: ["Automatic", "Manual", "CVT", "Other"],
      default: "Automatic",
    },

    fuelType: {
      type: String,
      enum: [
        "Petrol",
        "Diesel",
        "Hybrid",
        "Electric",
        "Plug-in Hybrid",
        "Other",
      ],
      default: "Petrol",
    },

    bodyType: {
      type: String,
      enum: [
        "Sedan",
        "SUV",
        "Coupe",
        "Convertible",
        "Hatchback",
        "Wagon",
        "Pickup",
        "Van",
        "Minivan",
        "Other",
      ],
      default: "Sedan",
    },

    condition: {
      type: String,
      enum: ["New", "Used"],
      default: "Used",
    },

    exteriorColor: {
      type: String,
      default: "",
      trim: true,
    },

    interiorColor: {
      type: String,
      default: "",
      trim: true,
    },

    engine: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    images: {
      type: [carImageSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["Available", "Reserved", "Sold"],
      default: "Available",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

carSchema.index({
  make: 1,
  model: 1,
  year: -1,
});

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;
