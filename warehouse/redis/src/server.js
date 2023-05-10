import dotenv from "dotenv";
import { createClient } from "redis";
import app, { initRoutes } from "./app.js";

dotenv.config();

const startRedis = async () => {
  try {
    const redis = createClient({ url: process.env.REDIS_URI });
    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();
    console.log("Connected to Redis");
    return redis;
  } catch (err) {
    console.log("Error connecting to Redis", err);
    if (redis) {
      redis.disconnect();
    }
    process.exit();
  }
};

const redis = await startRedis();

app.listen(process.env.PINECONE_PORT, async () => {
  console.log(
    `Redis service listening at http://localhost:${process.env.REDIS_URI}`
  );
  await initRoutes(redis);
});
