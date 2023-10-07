import TelegramBot from "node-telegram-bot-api";
import UserModel from "../models/user";

export const checkUserExists = async (msg: TelegramBot.Message) => {
  try {
    const user = await UserModel.findOne({ user_id: msg?.from?.id });

    return user?._id ? true : false;
  } catch (err: any) {
    console.error(`checkUserAuthentication err: ${err}`);
  }
};

export const VERIFY_ACCOUNT = [
  "Seems like you haven't verified your account yet.",
  "Type /verify to verify your account to proceed further.",
];
