import * as utils from "../../src/utils/utils";
import { PineconeClient } from "@pinecone-database/pinecone";

jest.mock("openai", () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn().mockImplementation(() => {
      const createEmbeddingMock = jest.fn();
      createEmbeddingMock.mockResolvedValue({
        data: {
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        },
      });
      return { createEmbedding: createEmbeddingMock };
    }),
  };
});

jest.mock("@pinecone-database/pinecone", () => {
  return {
    PineconeClient: jest.fn().mockImplementation(() => {
      return {
        Index: jest.fn().mockImplementation(() => {
          return { exists: jest.fn() };
        }),
        createIndex: jest.fn(),
      };
    }),
  };
});

describe("Utils Functions", () => {
  describe("createEmbedding", () => {
    it("should call OpenAIApi.createEmbedding and return embedding", async () => {
      const message = "Hello, world!";
      const mockEmbedding = [0.1, 0.2, 0.3];

      const embedding = await utils.createEmbedding(message);

      expect(embedding).toEqual(mockEmbedding);
    });
  });

  describe("getIndex", () => {
    describe("getIndex", () => {
      it("should create new index if it does not exist", async () => {
        const mockIndexName = "testIndex";
        process.env.PINECONE_INDEX = mockIndexName;

        const mockPinecone = new PineconeClient();
        mockPinecone.Index.mockReturnValue(null);

        await utils.getIndex(mockPinecone);

        expect(mockPinecone.createIndex).toHaveBeenCalled();
      });

      it("should use existing index if it exists", async () => {
        const mockIndexName = "testIndex";
        process.env.PINECONE_INDEX = mockIndexName;

        const mockPinecone = new PineconeClient();
        mockPinecone.Index.mockReturnValue(true);

        await utils.getIndex(mockPinecone);

        expect(mockPinecone.createIndex).not.toHaveBeenCalled();
      });
    });
  });
});
