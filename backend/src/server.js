import express from "express";
import messageRoute from "./routes/message.js";
import welcomeRoute from "./routes/welcome.js";
import speakRoute from "./routes/speak.js";
import cors from "cors";
import fileUpload from "express-fileupload";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.SERVER_PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/message", messageRoute);
app.use("/welcome", welcomeRoute);
app.use("/speak", speakRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
