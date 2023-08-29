import express, { Express, Request, Response } from "express";
import { router } from "./routes/routes.ts";
import 'dotenv/config'

import cors from 'cors'

console.log(process.env)

const app: Express = express();
const port: number = 4000;

app.use(cors())
app.use(express.json()); // Read json encoded body data
app.use(express.urlencoded({ extended: true })); // Url encoded bodies

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});

app.use('/', router)

