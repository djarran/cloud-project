import express, { Express, Request, Response } from "express";
import { router } from "./routes/routes.ts";
import 'dotenv/config'

console.log(process.env)

const app: Express = express();
const port: number = 4000;

app.use(express.json()); // Read json encoded body data
app.use(express.urlencoded({ extended: true })); // Url encoded bodies

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});

app.use('/', router)

