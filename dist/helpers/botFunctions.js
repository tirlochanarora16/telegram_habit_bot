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
exports.addSelectedHabitsToDB = exports.trackHabit = exports.listUserHabits = exports.createNewHabitInDB = exports.createHabit = exports.verifyUser = exports.startBot = void 0;
const user_1 = __importDefault(require("../models/user"));
const habits_1 = __importDefault(require("../models/habits"));
const dbConnection_1 = require("./dbConnection");
const tracker_1 = __importDefault(require("../models/tracker"));
const authentication_1 = require("./authentication");
const typeCheck_1 = require("./typeCheck");
const startBot = () => {
    try {
        const MESSAGES = [
            "Welcome to Habits. The only bot you'll need to track your habits.",
            "Before we continue, let's get you registred first.",
            "Use the command /verify to verify yourself first.",
        ];
        return MESSAGES;
    }
    catch (err) {
        console.error(`startBot err: ${err}`);
    }
};
exports.startBot = startBot;
const verifyUser = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, first_name, last_name } = message.from;
        let res = [];
        if (userId) {
            const user = yield user_1.default.find({
                user_id: userId,
            });
            if ((user === null || user === void 0 ? void 0 : user.length) === 0) {
                const newUser = yield user_1.default.create({
                    user_id: userId,
                    first_name: first_name !== null && first_name !== void 0 ? first_name : "",
                    last_name: last_name !== null && last_name !== void 0 ? last_name : "",
                });
                yield newUser.save();
                res = [
                    "Seems like you have just started with your habits tracking. We are happy that you are on-board with us.",
                ];
            }
            else {
                res = [
                    "You are already a user.",
                    "Use /create to create a new habit to keep track of.",
                    "Use /stats to see the status of your current habits.",
                ];
            }
        }
        return res;
    }
    catch (err) {
        console.error(`createUser err: ${err}`);
    }
});
exports.verifyUser = verifyUser;
const createHabit = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserInDB = yield (0, authentication_1.checkUserExists)(msg);
        if (!isUserInDB) {
            return authentication_1.VERIFY_ACCOUNT;
        }
        return [
            "Start typing below to add a new habit to keep track of.",
            "Tip: Add comma-separated habits to add multiple habits at once. (eg: Reading, Working-out, Playing Guitar,... etc).",
            "P.S: Feel free to add icons against your habits. 😉",
        ];
    }
    catch (err) {
        console.error(`createHabit err: ${err}`);
    }
});
exports.createHabit = createHabit;
const createNewHabitInDB = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.default.findOne({ user_id: (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id });
        const newHabit = yield habits_1.default.create({
            name: msg.text,
            user_id: user === null || user === void 0 ? void 0 : user._id,
        });
        user === null || user === void 0 ? void 0 : user.habits.push(newHabit === null || newHabit === void 0 ? void 0 : newHabit._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield newHabit.save();
        return true;
    }
    catch (err) {
        console.error(`createNewHabitInDB err: ${err}`);
        return false;
    }
});
exports.createNewHabitInDB = createNewHabitInDB;
const listUserHabits = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userInDB = yield (0, authentication_1.checkUserExists)(msg);
        if (!userInDB) {
            return authentication_1.VERIFY_ACCOUNT;
        }
        const user = yield user_1.default.findOne({ user_id: (_b = msg.from) === null || _b === void 0 ? void 0 : _b.id })
            .populate("habits")
            .exec();
        return user === null || user === void 0 ? void 0 : user.habits.map((habit) => ({
            id: habit._id,
            name: habit === null || habit === void 0 ? void 0 : habit.name,
        }));
    }
    catch (err) {
        console.error(`listUserHabits err: ${err}`);
    }
});
exports.listUserHabits = listUserHabits;
const trackHabit = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const habits = yield (0, exports.listUserHabits)(msg);
        if (habits && !(0, typeCheck_1.isStringArray)(habits)) {
            let optionsArray = [];
            for (let i = 0; i < habits.length; i++) {
                const current = habits[i];
                optionsArray.push([
                    {
                        text: current.name,
                        callback_data: current.id,
                    },
                ]);
            }
            const options = {
                reply_markup: {
                    inline_keyboard: optionsArray,
                },
            };
            return { habits, options };
        }
    }
    catch (err) {
        console.error(`trackHabit err: ${err}`);
    }
});
exports.trackHabit = trackHabit;
const addSelectedHabitsToDB = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        const checkUserHabits = yield tracker_1.default.findOne({
            user_telegram_id: (_c = msg === null || msg === void 0 ? void 0 : msg.from) === null || _c === void 0 ? void 0 : _c.id,
            for_date: new Date().toLocaleDateString("en-IN"),
        });
        // getting selected habits from redis
        let userHabits = yield dbConnection_1.redis.get(`user:${(_d = msg === null || msg === void 0 ? void 0 : msg.from) === null || _d === void 0 ? void 0 : _d.id}:track`);
        if (userHabits) {
            userHabits = JSON.parse(userHabits);
        }
        if (!checkUserHabits) {
            const user = yield user_1.default.findOne({ user_id: (_e = msg.from) === null || _e === void 0 ? void 0 : _e.id });
            const newRecord = yield tracker_1.default.create({
                user_id: user === null || user === void 0 ? void 0 : user._id,
                user_telegram_id: (_f = msg.from) === null || _f === void 0 ? void 0 : _f.id,
                for_date: new Date().toLocaleDateString("en-IN"),
                habits_completed: userHabits,
            });
            user === null || user === void 0 ? void 0 : user.days_completed.push(newRecord === null || newRecord === void 0 ? void 0 : newRecord._id);
            yield (user === null || user === void 0 ? void 0 : user.save());
            yield newRecord.save();
        }
        else {
            if (Array.isArray(userHabits)) {
                // converting type ObjectID to string
                const userHabitsInDB = checkUserHabits.habits_completed.map((habit) => habit.toString());
                // avoiding any duplication using Set
                const updatedHabits = new Set([...userHabitsInDB, ...userHabits]);
                // updating the original "habits_completed" array and saving it.
                checkUserHabits.habits_completed = Array.from(updatedHabits);
                yield checkUserHabits.save();
            }
        }
        return true;
    }
    catch (err) {
        console.error(`addSelectedHabitsToDB err: ${err}`);
    }
});
exports.addSelectedHabitsToDB = addSelectedHabitsToDB;
