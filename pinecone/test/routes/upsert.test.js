import express from "express";
import request from "supertest";
import upsertRoute from "../../src/routes/upsert.js";
import { createEmbedding, getIndex } from "../../src/utils/utils.js";

const mockPinecone = {};
const mockIndex = {
  upsert: jest.fn(),
};

jest.mock("../../src/utils/utils.js", () => ({
  createEmbedding: jest.fn(),
  getIndex: jest.fn(),
}));

describe("Upsert Route", () => {
  const app = express();
  app.use(express.json());

  beforeEach(() => {
    jest.clearAllMocks();
    getIndex.mockResolvedValue(mockIndex);
  });

  it("should upsert the message and return 200 status code", async () => {
    app.use("/", await upsertRoute(mockPinecone));
    const message = "Hello, world!";
    const messageResponse = "Hi there!";
    const mockMessageEmbedding = [0.1, 0.2, 0.3];
    const mockUpsertResponse = { success: true };

    createEmbedding.mockResolvedValue(mockMessageEmbedding);
    mockIndex.upsert.mockResolvedValue(mockUpsertResponse);

    const res = await request(app).post("/").send({ message, messageResponse });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(mockUpsertResponse);

    expect(createEmbedding).toHaveBeenCalledWith(message);
    expect(mockIndex.upsert).toHaveBeenCalled();
  });

  it("should return 500 status code if an error occurs", async () => {
    app.use("/", await upsertRoute(mockPinecone));
    const message = "Hello, world!";
    const messageResponse = "Hi there!";

    createEmbedding.mockImplementation(() => {
      throw new Error("Error creating embedding");
    });

    const res = await request(app).post("/").send({ message, messageResponse });

    expect(res.status).toEqual(500);
    expect(res.body.message).toEqual("Pinecone: Error upserting data");
    expect(res.body.error).toBeDefined();
  });
});
