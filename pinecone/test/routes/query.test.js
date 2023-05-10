import express from "express";
import request from "supertest";
import queryRoute from "../../src/routes/query.js";
import { createEmbedding, getIndex } from "../../src/utils/utils.js";

const mockPinecone = {};

const mockIndex = {
  query: jest.fn(),
};

jest.mock("../../src/utils/utils.js", () => ({
  createEmbedding: jest.fn(() => [0.1, 0.2, 0.3]),
  getIndex: jest.fn(),
}));

describe("Query Route", () => {
  const app = express();

  app.use(express.json());

  beforeEach(() => {
    jest.clearAllMocks();
    getIndex.mockResolvedValue(mockIndex);
  });

  it("should query Pinecone", async () => {
    app.use("/", await queryRoute(mockPinecone));
    const message = "Hello, world!";
    const topK = 5;
    const mockMessageEmbedding = [0.1, 0.2, 0.3];
    const mockQueryResponse = {
      matches: [{ id: "1", metadata: { messageResponse: "Hello, world!" } }],
    };

    createEmbedding.mockResolvedValue(mockMessageEmbedding);
    mockIndex.query.mockResolvedValue(mockQueryResponse);

    const res = await request(app).post("/").send({ message, topK });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(mockQueryResponse);

    expect(createEmbedding).toHaveBeenCalledWith(message);
    expect(mockIndex.query).toHaveBeenCalled();
  });
});
