import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    heroImage: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    postalCode: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },
    },

    openingHours: {
      monday: {
        type: String,
        default: "",
      },
      tuesday: {
        type: String,
        default: "",
      },
      wednesday: {
        type: String,
        default: "",
      },
      thursday: {
        type: String,
        default: "",
      },
      friday: {
        type: String,
        default: "",
      },
      saturday: {
        type: String,
        default: "",
      },
      sunday: {
        type: String,
        default: "",
      },
    },

    services: {
      type: [String],
      default: [],
    },

    socialLinks: {
      instagram: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      tiktok: {
        type: String,
        default: "",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Business =
  mongoose.models.Business ||
  mongoose.model("Business", businessSchema);

export default Business;