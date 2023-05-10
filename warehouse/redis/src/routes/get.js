import express from "express";

const router = express.Router();

const getRoute = async (redis) => {
  router.get("/", async (req, res) => {
    const { message } = req.body;

    let redisResponse = await redis.get(message);
    if (redisResponse) {
      redisResponse = JSON.parse(redisResponse);
      console.log(
        "Redis: cache hit: returning response",
        redisResponse.matches[0]
      );
      return res.status(200).json(redisResponse);
    } else {
      console.log("Redis: cache miss, querying Pinecone");
      res.status(500).json({ message: "Redis: Error querying data" });
    }
  });
  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /redis-get Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`,
  });
});

export default getRoute;
