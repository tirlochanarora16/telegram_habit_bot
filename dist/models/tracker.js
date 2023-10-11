"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trackerSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: false,
    },
    user_telegram_id: {
        type: String,
        required: true,
        unique: false,
    },
    for_date: {
        type: String,
        required: true,
    },
    habits_completed: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Habits",
        },
    ],
}, {
    timestamps: true,
});
const TrackerModel = mongoose_1.default.model("Tracker", trackerSchema);
exports.default = TrackerModel;
