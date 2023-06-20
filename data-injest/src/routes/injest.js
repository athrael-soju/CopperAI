import express from "express";

const router = express.Router();

const injestRoute = async () => {
  router.post("/", async (req, res) => {});
  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest data-injest route, running on port: ${process.env.DATA_INJEST_PORT}`,
  });
});

export default injestRoute;
