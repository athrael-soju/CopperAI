import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";

import injestRoute from "./routes/injest.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/injest", injestRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the data-injest server, running on port ${process.env.DATA_INJEST_PORT}`,
  });
});

export default app;
