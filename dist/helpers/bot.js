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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.botOnText = exports.bot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnection_1 = require("./dbConnection");
const botFunctions_1 = require("./botFunctions");
dotenv_1.default.config();
exports.bot = new node_telegram_bot_api_1.default((_a = process.env.TELEGRAM_BOT) !== null && _a !== void 0 ? _a : "", {
    polling: true,
});
const getChatId = (msg) => { var _a; return (_a = msg.chat) === null || _a === void 0 ? void 0 : _a.id; };
const botOnText = (regex, _, callback) => {
    return exports.bot.onText(regex, (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let callBackResponse;
        if (callback) {
            callBackResponse = yield callback(message);
        }
        const redisKey = `user:${(_a = message.from) === null || _a === void 0 ? void 0 : _a.id}`;
        // keeping a track of last command entered by the user with 5 min expiration.
        yield dbConnection_1.redis.set(redisKey, regex.source.slice(1));
        yield dbConnection_1.redis.expire(redisKey, 300);
        // if response is array, then loop through the array and send messages one-by-one.
        if (Array.isArray(callBackResponse)) {
            for (const msg of callBackResponse) {
                yield exports.bot.sendMessage((_b = getChatId(message)) !== null && _b !== void 0 ? _b : "", msg.name || msg);
            }
            return;
        }
        // this case will run when we will have to pass options to the chat
        else if ((callBackResponse === null || callBackResponse === void 0 ? void 0 : callBackResponse.constructor) === Object) {
            exports.bot.sendMessage((_c = getChatId(message)) !== null && _c !== void 0 ? _c : "", `What habits did you perform today? Type "Done" when all habits are selected.`, callBackResponse === null || callBackResponse === void 0 ? void 0 : callBackResponse.options);
            return;
        }
    }));
};
exports.botOnText = botOnText;
exports.bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g;
    try {
        const userId = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.id;
        const redisKey = `user:${userId}`;
        const userLastCommand = yield dbConnection_1.redis.get(redisKey);
        // checking the last command the user entered (fetching from redis)
        // if the last command was "/create", the the subsequent text will be used to add new habits to the habits collection.
        const currentText = msg.text;
        if (!(currentText === null || currentText === void 0 ? void 0 : currentText.includes("/"))) {
            if (userLastCommand === "/create") {
                const res = yield (0, botFunctions_1.createNewHabitInDB)(msg);
                // if "res" is true, then the habit is successfully added in the DB
                if (res) {
                    exports.bot.sendMessage((_c = getChatId(msg)) !== null && _c !== void 0 ? _c : "", `"${currentText}" added as a habit.`);
                }
            }
            else if (userLastCommand === "/track" &&
                ((_e = (_d = currentText === null || currentText === void 0 ? void 0 : currentText.trim()) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === null || _e === void 0 ? void 0 : _e.includes("done"))) {
                // here we will store the selected habits in mongodb
                const res = yield (0, botFunctions_1.addSelectedHabitsToDB)(msg);
                if (res) {
                    exports.bot.sendMessage((_f = getChatId(msg)) !== null && _f !== void 0 ? _f : "", "Habits successfully added for the day. Keep going!");
                    yield dbConnection_1.redis.del(`user:${(_g = msg.from) === null || _g === void 0 ? void 0 : _g.id}:track`);
                }
            }
        }
    }
    catch (err) {
        console.error("bot on message", err);
    }
}));
// this will only run when the user is tracking their habits for the day
exports.bot.on("callback_query", (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const userId = (_h = query === null || query === void 0 ? void 0 : query.from) === null || _h === void 0 ? void 0 : _h.id;
        const userKey = `user:${userId}:track`;
        const checkData = yield dbConnection_1.redis.get(userKey);
        const msg = query.data;
        if (!checkData) {
            // create new array in redis
            yield dbConnection_1.redis.set(userKey, JSON.stringify([msg]));
            return;
        }
        // update the array in redis
        let existingData = JSON.parse(checkData);
        if (Array.isArray(existingData)) {
            existingData.push(msg);
        }
        const uniqueSelection = new Set(existingData);
        yield dbConnection_1.redis.set(userKey, JSON.stringify(Array.from(uniqueSelection)));
    }
    catch (err) {
        console.error(`Bot on callback_query err: ${err}`);
    }
}));
