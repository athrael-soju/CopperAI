import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import queryRoute from "../src/routes/query.js";
import upsertRoute from "../src/routes/upsert.js";
import injestRoute from "../src/routes/injest.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const initRoutes = async (pinecone) => {
  const queryRouter = await queryRoute(pinecone);
  const upsertRouter = await upsertRoute(pinecone);
  const injestRouter = await injestRoute(pinecone);
  app.use("/query", queryRouter);
  app.use("/upsert", upsertRouter);
  app.use("/injest", injestRouter);
};

app.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the Pinecone server, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default app;
export { initRoutes };
