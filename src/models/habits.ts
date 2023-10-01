import mongoose from "mongoose";

const habitsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const HabitsModel = mongoose.model("Habits", habitsSchema);

export default HabitsModel;
