"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnection_1 = __importDefault(require("./helpers/dbConnection"));
const bot_1 = require("./helpers/bot");
const botFunctions_1 = require("./helpers/botFunctions");
const app = (0, express_1.default)();
(0, bot_1.botOnText)(/\/start/, "Start Bot", botFunctions_1.startBot);
(0, bot_1.botOnText)(/\/verify/, "Verify User", botFunctions_1.verifyUser);
(0, bot_1.botOnText)(/\/create/, "Create new habit", botFunctions_1.createHabit);
(0, bot_1.botOnText)(/\/list/, "List all habits", botFunctions_1.listUserHabits);
(0, bot_1.botOnText)(/\/track/, "track habit", botFunctions_1.trackHabit);
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    // awaiting mongodb conenction before proceeding further
    try {
        if (yield (0, dbConnection_1.default)()) {
            console.log(`Server running on port 3000! 🚀`);
        }
    }
    catch (err) {
        console.warn(`Error starting the server: ${err}`);
    }
}));
