import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    for_date: {
      type: Date,
      required: true,
    },
    habits_completed: [String],
  },
  {
    timestamps: true,
  }
);

const TrackerModel = mongoose.model("Tracker", trackerSchema);

export default TrackerModel;
