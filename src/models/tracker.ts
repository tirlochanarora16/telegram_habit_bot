import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    user_telegram_id: {
      type: String,
      required: true,
    },
    for_date: {
      type: String,
      required: true,
    },
    habits_completed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habits",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TrackerModel = mongoose.model("Tracker", trackerSchema);

export default TrackerModel;
