"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_BOT, { polling: true });
const getChatId = (msg) => { var _a; return (_a = msg.chat) === null || _a === void 0 ? void 0 : _a.id; };
bot.onText(/\/verify/, (message) => {
    bot.sendMessage(getChatId(message), "Verify yourself first");
});
bot.onText(/\/new/, (message) => {
    var _a, _b;
    console.log("user id", (_a = message.from) === null || _a === void 0 ? void 0 : _a.id);
    bot.sendMessage(getChatId(message), `Create a new habit ${(_b = message.from) === null || _b === void 0 ? void 0 : _b.first_name}`);
});
app.listen(3000, () => console.log(`Server running on port 3000! 🚀`));
