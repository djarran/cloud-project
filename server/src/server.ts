import express, { Express, Request, Response } from "express";
import { router } from "./routes/routes.ts";
import 'dotenv/config'
import cors from 'cors'
import { CronJob } from "cron";
import { createMessage } from "./helpers/discord.helper.ts";
import { schedule } from "node-cron";
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

// AWS.config.getCredentials(() => {
// })

(async () => {
  try {
    console.log("attempting to create bucket")
    await s3.createBucket({ Bucket: bucketName }).promise()
    console.log(`Created bucket: ${bucketName}`)
  }
  catch (err: any) {
    if (err.statusCode !== 409) {
      console.log(`Error creating bucket: ${err}`)
    }
  }
})()

const key = 'Woof'
const s3Key = `wikipedia-${key}`

const objectParams = { Bucket: bucketName, Key: s3Key, Body: 'Sam Wonder Dog' };


(async () => {
  try {
    await s3.putObject(objectParams).promise()
    const data = await s3.getObject({ Bucket: bucketName, Key: s3Key }).promise()
    console.log(data.Body)

    console.log(`Successfully uploaded data to ${bucketName}${s3Key}`)
  }
  catch (err: any) {
    console.log(err, err.stack)
  }
})()

app.use('/', router) // Initialise router

/**
 * Create new cron job to post random YouTube and Reddit content in a set interval
 * Current interval: every 10 seconds
 */
// const postToDiscord = new CronJob(
//   `0/10 * * * * *`,
//   async function () {
//     await createMessage('hey')
//   }
// )
// postToDiscord.start()


