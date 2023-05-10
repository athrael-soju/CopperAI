import express from "express";
import cors from "cors";

import getRoute from "../src/routes/get.js";
import putRoute from "../src/routes/put.js";

const app = express();
app.use(cors());
app.use(express.json());

const initRoutes = async (redis) => {
  const getRouter = await getRoute(redis);
  const putRouter = await putRoute(redis);
  app.use("/get", getRouter);
  app.use("/put", putRouter);
};

app.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the Redis server, running on ${process.env.REDIS_URI}`,
  });
});

export default app;
export { initRoutes };
