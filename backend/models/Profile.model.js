import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    professions: {
      type: [String],
      default: [],
    },

    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);