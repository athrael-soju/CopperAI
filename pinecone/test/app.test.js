import request from "supertest";
import { PineconeClient } from "@pinecone-database/pinecone";

import app, { initRoutes } from "../src/app.js";

const startPinecone = async () => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
  console.log("Connected to Pinecone");
  return pinecone;
};

describe("Pinecone service", () => {
  let pinecone;

  beforeAll(async () => {
    pinecone = await startPinecone();
    await initRoutes(pinecone);
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
