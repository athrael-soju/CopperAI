import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import authRoute from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";

import messageRoute from "./routes/message.js";
import speakRoute from "./routes/speak.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/message", messageRoute);
app.use("/speak", speakRoute);
app.use("/auth", authRoute);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(process.env.SERVER_PORT, async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
      if (process.env.PINECONE_ENABLED === "true") {
        console.log("Pinecone access enabled");
      } else {
        console.log("Pinecone access disabled");
      }
    } catch (err) {
      console.error("Error connecting to mongodb", err);
    }
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  });
}
export default app;
