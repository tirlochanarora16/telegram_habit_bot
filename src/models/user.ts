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
      required: false,
      unique: false,
      default: "",
    },
    last_name: {
      type: String,
      required: false,
      unique: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
