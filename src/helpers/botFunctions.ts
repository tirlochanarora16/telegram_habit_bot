import TelegramBot from "node-telegram-bot-api";
import UserModel from "../models/user";

export const startCallback = async (message: TelegramBot.Message) => {
  try {
    const { id: userId, first_name, last_name } = message.from!;

    let res: string = "";

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

        res =
          "Seems like you have just started with your habits tracking. We are happy that you are on-board with us.";
      } else {
        res = "You are already a user";
      }
    }

    return res;
  } catch (err: any) {
    console.error(`startCallback err: ${err}`);
  }
};
