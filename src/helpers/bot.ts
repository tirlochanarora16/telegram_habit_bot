import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

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
    bot.sendMessage(getChatId(message) ?? "", callBackResponse ?? msg);
  });
};
