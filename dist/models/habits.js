"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const habitsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
    },
}, {
    timestamps: true,
});
const HabitsModel = mongoose_1.default.model("Habits", habitsSchema);
exports.default = HabitsModel;
