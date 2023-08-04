import express, { Request, Response } from "express";

import { connection } from "./configs/db";
import { userRouter } from "./routes/User.routes";
import { invoiceRouter } from "./routes/Invoice.routes";

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Welcome to Mokaro");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/invoices", invoiceRouter);

//Starting the server
const port = process.env.port || 5000;

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`Listening at port :${port}`);
});
