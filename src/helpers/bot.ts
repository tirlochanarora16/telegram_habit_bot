import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { redis } from "./dbConnection";
import { createNewHabitInDB } from "./botFunctions";

dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT ?? "", {
  polling: true,
});

const getChatId: (msg: TelegramBot.Message) => number | undefined = (msg) =>
  msg.chat?.id;

export const botOnText = (
  regex: RegExp,
  msg: string,
  callback?: (messsage: TelegramBot.Message) => any
) => {
  return bot.onText(regex, async (message) => {
    let callBackResponse: any;
    if (callback) {
      callBackResponse = await callback(message);
    }

    const redisKey = `user:${message.from?.id}`;

    // keeping a track of last command entered by the user with 30 min expiration.
    await redis.set(redisKey, regex.source.slice(1));
    await redis.expire(redisKey, 1800);

    // if response is array, then loop through the array and send messages one-by-one.
    if (Array.isArray(callBackResponse)) {
      for (const msg of callBackResponse) {
        await bot.sendMessage(getChatId(message) ?? "", msg);
      }
      return;
    }
    bot.sendMessage(getChatId(message) ?? "", callBackResponse ?? msg);
  });
};

bot.on("message", async (msg) => {
  try {
    const userId = msg.from?.id;
    const redisKey = `user:${userId}`;
    const userKeyValue = await redis.get(redisKey);

    // checking the last command the user entered (fetching from redis)
    // if the last command was "/create", the the subsequent text will be used to add new habits to the habits collection.
    const currentText = msg.text;
    if (userKeyValue === "/create" && !currentText?.includes("/")) {
      const res = await createNewHabitInDB(msg);
      if (res) {
        bot.sendMessage(
          getChatId(msg) ?? "",
          `"${currentText}" added as habit`
        );
      }
    }
  } catch (err: any) {
    console.error("bot on message", err);
  }
});
