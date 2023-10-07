import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { redis } from "./dbConnection";
import { addSelectedHabitsToDB, createNewHabitInDB } from "./botFunctions";

dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT ?? "", {
  polling: true,
});

const getChatId: (msg: TelegramBot.Message) => number | undefined = (msg) =>
  msg.chat?.id;

export const botOnText = (
  regex: RegExp,
  _: string,
  callback?: (messsage: TelegramBot.Message) => any
) => {
  return bot.onText(regex, async (message) => {
    let callBackResponse: any;
    if (callback) {
      callBackResponse = await callback(message);
    }

    const redisKey = `user:${message.from?.id}`;

    // keeping a track of last command entered by the user with 5 min expiration.

    await redis.set(redisKey, regex.source.slice(1));
    await redis.expire(redisKey, 300);

    // if response is array, then loop through the array and send messages one-by-one.
    if (Array.isArray(callBackResponse)) {
      for (const msg of callBackResponse) {
        await bot.sendMessage(getChatId(message) ?? "", msg);
      }
      return;
    }
    // this case will run when we will have to pass options to the chat
    else if (callBackResponse?.constructor === Object) {
      bot.sendMessage(
        getChatId(message) ?? "",
        `What habits did you perform today? Type "Done" when all habits are selected.`,
        callBackResponse?.options
      );
      return;
    }
  });
};

bot.on("message", async (msg) => {
  try {
    const userId = msg.from?.id;
    const redisKey = `user:${userId}`;
    const userLastCommand = await redis.get(redisKey);

    // checking the last command the user entered (fetching from redis)
    // if the last command was "/create", the the subsequent text will be used to add new habits to the habits collection.
    const currentText = msg.text;
    if (!currentText?.includes("/")) {
      if (userLastCommand === "/create") {
        const res = await createNewHabitInDB(msg);
        // if "res" is true, then the habit is successfully added in the DB
        if (res) {
          bot.sendMessage(
            getChatId(msg) ?? "",
            `"${currentText}" added as a habit.`
          );
        }
      } else if (
        userLastCommand === "/track" &&
        currentText?.trim()?.toLowerCase()?.includes("done")
      ) {
        // here we will store the selected habits in mongodb
        const res = await addSelectedHabitsToDB(msg);

        if (res) {
          bot.sendMessage(
            getChatId(msg) ?? "",
            "Habits successfully added for the day. Keep going!"
          );

          await redis.del(`user:${msg.from?.id}:track`);
        }
      }
    }
  } catch (err: any) {
    console.error("bot on message", err);
  }
});

// this will only run when the user is tracking their habits for the day
bot.on("callback_query", async (query) => {
  try {
    const userId = query?.from?.id;
    const userKey = `user:${userId}:track`;

    const checkData = await redis.get(userKey);
    const msg = query.data;

    if (!checkData) {
      // create new array in redis
      await redis.set(userKey, JSON.stringify([msg]));
      return;
    }

    // update the array in redis
    let existingData = JSON.parse(checkData);

    if (Array.isArray(existingData)) {
      existingData.push(msg);
    }

    const uniqueSelection = new Set(existingData);

    await redis.set(userKey, JSON.stringify(Array.from(uniqueSelection)));
  } catch (err: any) {
    console.error(`Bot on callback_query err: ${err}`);
  }
});
