import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
dotenv.config();

const app = express();

const bot = new TelegramBot(process.env.TELEGRAM_BOT!, { polling: true });

const getChatId: (msg: TelegramBot.Message) => number | undefined = (msg) =>
  msg.chat?.id;

bot.onText(/\/verify/, (message) => {
  bot.sendMessage(getChatId(message)!, "Verify yourself first");
});

bot.onText(/\/new/, (message) => {
  bot.sendMessage(
    getChatId(message)!,
    `Create a new habit ${message.from?.first_name}`
  );
});

app.listen(3000, () => console.log(`Server running on port 3000! 🚀`));
