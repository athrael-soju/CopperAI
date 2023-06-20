import express from "express";
import dotenv from "dotenv";

import injestRoute from "./routes/injest.js";

dotenv.config();

const app = express();

app.use("/injest", injestRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the data-injest server, running on port ${process.env.DATA_INJEST_PORT}`,
  });
});

export default app;
