import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";

import authRoute from "./routes/auth.js";
import messageRoute from "./routes/message.js";
import speakRoute from "./routes/speak.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/speak", speakRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the backend-core server, running on port ${process.env.SERVER_PORT}`,
  });
});

export default app;
