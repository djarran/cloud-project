import express, { Express, Request, Response } from "express";
import { router } from "./routes/routes.ts";
import 'dotenv/config'
import cors from 'cors'
import { CronJob } from "cron";
import { createMessage } from "./helpers/discord.helper.ts";
import { schedule } from "node-cron";

const app: Express = express();
const port: number = 3001;

app.use(cors())
app.use(express.json()); // Read json encoded body data
app.use(express.urlencoded({ extended: true })); // Url encoded bodies

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});

app.use('/', router) // Initialise router

/**
 * Create new cron job to post random YouTube and Reddit content in a set interval
 * Current interval: every 10 seconds
 */
const postToDiscord = new CronJob(
  `0/10 * * * * *`,
  async function () {
    await createMessage('hey')
  }
)
postToDiscord.start()


