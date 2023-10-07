"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Habits",
        },
    ],
    days_completed: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tracker",
        },
    ],
}, {
    timestamps: true,
});
const UserModel = mongoose_1.default.model("Users", userSchema);
exports.default = UserModel;
