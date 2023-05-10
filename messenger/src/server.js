import mongoose from "mongoose";
import app from "./app.js";

const startMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to mongodb", err);
  }
};

app.listen(process.env.SERVER_PORT, async () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  await startMongoose();
});
