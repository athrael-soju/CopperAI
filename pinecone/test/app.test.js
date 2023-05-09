import request from "supertest";
import dotenv from "dotenv";
import { PineconeClient } from "@pinecone-database/pinecone";
import { createClient } from "redis-mock";
import app, { initRoutes } from "../src/app.js";

dotenv.config();

const startPinecone = async () => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
  console.log("Connected to Pinecone");
  return pinecone;
};

const startRedis = async () => {
  const redisClient = createClient();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  console.log("Connected to Redis (mock)");
  return redisClient;
};

describe("Pinecone service", () => {
  let pinecone;
  let redisClient;

  beforeAll(async () => {
    pinecone = await startPinecone();
    redisClient = await startRedis();
    await initRoutes(pinecone, redisClient);
  });

  it("should check if the server is running", async () => {
    const res = await request(app).get("/");
    expect(res.body.message).toEqual(
      `You've reached the Pinecone server, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`
    );
  });

  it("should respond to /query route", async () => {
    const res = await request(app).get("/query");
    expect(res.body.message).toEqual(
      `You've reached the /query Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`
    );
  });

  it("should respond to /upsert route", async () => {
    const res = await request(app).get("/upsert");
    expect(res.body.message).toEqual(
      `You've reached the /upsert Pinecone route, running on port ${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`
    );
  });
});
