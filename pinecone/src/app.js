import express from "express";
import cors from "cors";
import queryRoute from "../src/routes/query.js";
import upsertRoute from "../src/routes/upsert.js";

const app = express();
app.use(cors());
app.use(express.json());

const initRoutes = async (pinecone, redisClient) => {
  const queryRouter = await queryRoute(pinecone, redisClient);
  const upsertRouter = await upsertRoute(pinecone);
  app.use("/query", queryRouter);
  app.use("/upsert", upsertRouter);
};

app.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the Pinecone server, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default app;
export { initRoutes };
