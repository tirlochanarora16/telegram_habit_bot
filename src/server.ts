import express from "express";

import connectDB from "./helpers/dbConnection";
import { botOnText } from "./helpers/bot";
import { startBot, verifyUser } from "./helpers/botFunctions";

const app = express();

botOnText(/\/start/, "Start Bot", startBot);
botOnText(/\/verify/, "Verify User", verifyUser);

app.listen(3000, async () => {
  // awaiting mongodb conenction before proceeding further
  try {
    if (await connectDB()) {
      console.log(`Server running on port 3000! 🚀`);
    }
  } catch (err: any) {
    console.warn(`Error starting the server: ${err}`);
  }
});
