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

trackerSchema.virtual("formatted_date").get(function () {
  return this.for_date.toLocaleDateString("en-IN");
});

const TrackerModel = mongoose.model("Tracker", trackerSchema);

export default TrackerModel;
