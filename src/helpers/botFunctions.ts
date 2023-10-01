import TelegramBot from "node-telegram-bot-api";
import UserModel from "../models/user";

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

    let res: string | string[] = "";

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
