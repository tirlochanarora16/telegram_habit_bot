import express from "express";

import connectDB from "./helpers/dbConnection";
import { botOnText } from "./helpers/bot";

const app = express();

botOnText(/\/verify/, "Verify yourself hello world 123");
botOnText(/\/update/, "update yourself AWS EC2");

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
