import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    habits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habits",
      },
    ],
    days_completed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tracker",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
