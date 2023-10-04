import express, { Express, Request, Response } from "express";
import { router } from "./routes/routes.ts";
import 'dotenv/config'
import cors from 'cors'
import { createClient } from "redis";
import AWS from "aws-sdk"

const app: Express = express();
const port: number = 3001;

app.use(cors())
app.use(express.json()); // Read json encoded body data
app.use(express.urlencoded({ extended: true })); // Url encoded bodies

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});

export const redisClient = createClient({
  url: 'redis://redis:6379'
});
(async () => {
  try {
    await redisClient.connect()
  }
  catch (err) {
    console.log(err)
  }
})()

export const bucketName = "n10269088-wikipedia-store"

export const s3 = new AWS.S3({ region: 'ap-southeast-2' });

app.use('/', router) // Initialise router
