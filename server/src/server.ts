import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 4000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("All good to go!");
});

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
