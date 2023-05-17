import mongoose from "mongoose";
import app from "./app.js";

const startMongoose = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB", error));
};

app.listen(process.env.SERVER_PORT, async () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  await startMongoose();
});
