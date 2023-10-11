import TelegramBot from "node-telegram-bot-api";
import UserModel from "../models/user";
import HabitsModel from "../models/habits";
import { redis } from "./dbConnection";
import TrackerModel from "../models/tracker";
import { VERIFY_ACCOUNT, checkUserExists } from "./authentication";
import { isStringArray } from "./typeCheck";

export const startBot = () => {
  try {
    const MESSAGES = [
      "Welcome to Habits. The only bot you'll need to track your habits.",
      "Before we continue, let's get you registred first.",
      "Use the command /verify to verify yourself first.",
    ];
    return MESSAGES;
  } catch (err: any) {
    console.error(`startBot err: ${err}`);
  }
};

export const verifyUser = async (message: TelegramBot.Message) => {
  try {
    const { id: userId, first_name, last_name } = message.from!;

    let res: string[] = [];

    if (userId) {
      const user = await UserModel.find({
        user_id: userId,
      });

      if (user?.length === 0) {
        const newUser = await UserModel.create({
          user_id: userId,
          first_name: first_name ?? "",
          last_name: last_name ?? "",
        });

        await newUser.save();

        res = [
          "Seems like you have just started with your habits tracking. We are happy that you are on-board with us.",
        ];
      } else {
        res = [
          "You are already a user.",
          "Use /create to create a new habit to keep track of.",
          "Use /stats to see the status of your current habits.",
        ];
      }
    }

    return res;
  } catch (err: any) {
    console.error(`createUser err: ${err}`);
  }
};

export const createHabit = async (msg: TelegramBot.Message) => {
  try {
    const isUserInDB = await checkUserExists(msg);
    if (!isUserInDB) {
      return VERIFY_ACCOUNT;
    }

    return [
      "Start typing below to add a new habit to keep track of.",
      "Tip: Add comma-separated habits to add multiple habits at once. (eg: Reading, Working-out, Playing Guitar,... etc).",
      "P.S: Feel free to add icons against your habits. 😉",
    ];
  } catch (err: any) {
    console.error(`createHabit err: ${err}`);
  }
};

export const createNewHabitInDB = async (msg: TelegramBot.Message) => {
  try {
    const user = await UserModel.findOne({ user_id: msg.from?.id });

    const newHabit = await HabitsModel.create({
      name: msg.text,
      user_id: user?._id,
    });

    user?.habits.push(newHabit?._id);

    await user?.save();
    await newHabit.save();

    return true;
  } catch (err: any) {
    console.error(`createNewHabitInDB err: ${err}`);
    return false;
  }
};

interface ListUserHabitsRes {
  id: string;
  name: string;
}

export const listUserHabits = async (
  msg: TelegramBot.Message
): Promise<string[] | ListUserHabitsRes[] | undefined> => {
  try {
    const userInDB = await checkUserExists(msg);

    if (!userInDB) {
      return VERIFY_ACCOUNT;
    }

    const user = await UserModel.findOne({ user_id: msg.from?.id })
      .populate("habits")
      .exec();

    return user?.habits.map((habit: any) => ({
      id: habit._id,
      name: habit?.name,
    }));
  } catch (err: any) {
    console.error(`listUserHabits err: ${err}`);
  }
};

export const trackHabit = async (msg: TelegramBot.Message) => {
  try {
    const habits = await listUserHabits(msg);

    if (habits && !isStringArray(habits)) {
      let optionsArray: any[] = [];

      for (let i = 0; i < habits!.length; i++) {
        const current = habits![i];

        optionsArray.push([
          {
            text: current.name,
            callback_data: current.id,
          },
        ]);
      }

      const options: TelegramBot.SendMessageOptions = {
        reply_markup: {
          inline_keyboard: optionsArray,
        },
      };

      return { habits, options };
    }
  } catch (err: any) {
    console.error(`trackHabit err: ${err}`);
  }
};

export const addSelectedHabitsToDB = async (msg: TelegramBot.Message) => {
  try {
    const checkUserHabits = await TrackerModel.findOne({
      user_telegram_id: msg?.from?.id,
      for_date: new Date().toLocaleDateString("en-IN"),
    });

    // getting selected habits from redis
    let userHabits = await redis.get(`user:${msg?.from?.id}:track`);
    if (userHabits) {
      userHabits = JSON.parse(userHabits);
    }

    if (!checkUserHabits) {
      const user = await UserModel.findOne({ user_id: msg.from?.id });
      const newRecord = await TrackerModel.create({
        user_id: user?._id,
        user_telegram_id: msg.from?.id,
        for_date: new Date().toLocaleDateString("en-IN"),
        habits_completed: userHabits,
      });

      user?.days_completed.push(newRecord?._id);

      await user?.save();

      await newRecord.save();
    } else {
      if (Array.isArray(userHabits)) {
        // converting type ObjectID to string
        const userHabitsInDB = checkUserHabits.habits_completed.map((habit) =>
          habit.toString()
        );

        // avoiding any duplication using Set
        const updatedHabits = new Set([...userHabitsInDB, ...userHabits]);

        // updating the original "habits_completed" array and saving it.
        checkUserHabits.habits_completed = Array.from(updatedHabits);
        await checkUserHabits.save();
      }
    }
    return true;
  } catch (err: any) {
    console.error(`addSelectedHabitsToDB err: ${err}`);
  }
};
