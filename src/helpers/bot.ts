import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT ?? "", { polling: true });

const getChatId: (msg: TelegramBot.Message) => number | undefined = (msg) =>
  msg.chat?.id;

export const botOnText = (regex: RegExp, msg: string) => {
  return bot.onText(regex, (message) => {
    bot.sendMessage(getChatId(message) ?? "", msg);
  });
};
