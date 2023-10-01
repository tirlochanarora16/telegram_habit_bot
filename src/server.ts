import express from "express";

import connectDB from "./helpers/dbConnection";
import { botOnText } from "./helpers/bot";
import { startBot } from "./helpers/botFunctions";

const app = express();

botOnText(/\/start/, "let's start", startBot);

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
