import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
import fileUpload from "express-fileupload";
import authRoute from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";

import messageRoute from "./routes/message.js";
import speakRoute from "./routes/speak.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

createClient({ url: process.env.REDIS_URI })
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis Client Error", err);
  });

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/message", messageRoute);
app.use("/speak", speakRoute);
app.use("/auth", authRoute);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
