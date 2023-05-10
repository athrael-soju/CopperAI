import express from "express";

const router = express.Router();

const putRoute = async (redis) => {
  router.post("/", async (req, res) => {
    try {
      const { message, queryResponse } = req.body;
      await redis.set(message, JSON.stringify(queryResponse));
      console.log("Redis: response cached: ", queryResponse.matches[0]);
      res.status(200).json(queryResponse);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Redis: Error caching data" });
    }
  });
  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /redis-put Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default putRoute;
