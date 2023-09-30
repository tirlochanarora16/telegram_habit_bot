import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
