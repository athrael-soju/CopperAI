import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import dotEnv from "dotenv";
import app from "../../src/app.js";
import pineconeAPI from "../../src/api/pineconeAPI.js";
import openaiAPI from "../../src/api/openaiAPI.js";

dotEnv.config();

chai.use(chaiHttp);
const { expect } = chai;

describe("Message", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /message", () => {
    it("should return a 200 status", async () => {
      const res = await chai.request(app).get("/message");

      expect(res.status).to.equal(200);
      expect(res.text).to.include("You've reached the /message server route");
    });
  });

  describe("POST /message", () => {
    it("should return the generated response from OpenAI", async () => {
      const reqBody = {
        username: "testUser",
        message: "Hello!",
      };
      process.env.PINECONE_ENABLED = "false";
      const responseText = "Hello, testUser! How can I help you today?";
      sinon
        .stub(openaiAPI, "generateResponseFromOpenAI")
        .resolves(responseText);
      sinon
        .stub(pineconeAPI, "getConversationFromPinecone")
        .throws("Should not be called");

      const res = await chai.request(app).post("/message").send(reqBody);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: responseText });
    });

    it("should return the response from Pinecone if enabled", async () => {
      const reqBody = {
        username: "testUser",
        message: "Hello!",
      };
      process.env.PINECONE_ENABLED = "true";
      const pineconeResponseText = "Hello from Pinecone!";

      sinon
        .stub(pineconeAPI, "getConversationFromPinecone")
        .resolves(pineconeResponseText);
      sinon
        .stub(openaiAPI, "generateResponseFromOpenAI")
        .throws("Should not be called");

      const res = await chai.request(app).post("/message").send(reqBody);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: pineconeResponseText });
    });

    it("should store the conversation to Pinecone if enabled", async () => {
      const reqBody = {
        username: "testUser",
        message: "Hello!",
      };
      process.env.PINECONE_ENABLED = "true";
      const responseText = "Hello, testUser! How can I help you today?";

      sinon.stub(pineconeAPI, "getConversationFromPinecone").resolves(null);
      sinon
        .stub(openaiAPI, "generateResponseFromOpenAI")
        .resolves(responseText);
      const storeConversationToPineconeStub = sinon
        .stub(pineconeAPI, "storeConversationToPinecone")
        .resolves();

      const res = await chai.request(app).post("/message").send(reqBody);

      expect(res.status).to.equal(200);
      expect(storeConversationToPineconeStub.calledOnce).to.be.true;
    });
  });
});
