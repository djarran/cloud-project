import express, { Express, Request, Response } from "express";
import { router } from "./routes/routes.ts";
import 'dotenv/config'
import cors from 'cors'
import { CronJob } from "cron";
import { createMessage } from "./helpers/discord.helper.ts";

const app: Express = express();
const port: number = 3001;

app.use(cors())
app.use(express.json()); // Read json encoded body data
app.use(express.urlencoded({ extended: true })); // Url encoded bodies

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});

app.use('/', router)

// schedule('10 * * * * *', () => {
//   console.log('wow')
// })
// 
const wow = new CronJob(
  `* * * * * *`,
  async function () {
    await createMessage('hey')
  }
)
// wow.start()


