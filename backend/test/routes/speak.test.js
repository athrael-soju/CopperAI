import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import fs from "fs";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

import app from "../../src/app.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Speak", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /speak", () => {
    it("should return a 200 status", async () => {
      const res = await chai.request(app).get("/speak");

      expect(res.status).to.equal(200);
      expect(res.text).to.include(
        "You've reached the /speak server route, running on port"
      );
    });
  });

  describe("POST /speak", () => {
    it("should return a generated audio file", (done) => {
      const reqBody = {
        text: "Hello, test!",
      };

      const fakeAudioContent = Buffer.from("fake-audio-content");
      const fakeResponse = { audioContent: fakeAudioContent };

      const synthesizeSpeechStub = sinon
        .stub(TextToSpeechClient.prototype, "synthesizeSpeech")
        .resolves([fakeResponse]);

      const writeFileSyncStub = sinon.stub(fs, "writeFileSync");
      const unlinkStub = sinon.stub(fs, "unlink");

      chai
        .request(app)
        .post("/speak")
        .send(reqBody)
        .end((err, res) => {
          expect(synthesizeSpeechStub.calledOnce).to.be.true;
          expect(writeFileSyncStub.calledOnce).to.be.true;
          expect(res.header["content-type"]).to.equal(
            "application/json; charset=utf-8"
          );
          expect(res.body).to.not.be.empty;
          expect(unlinkStub.calledOnce).to.be.true;
          done();
        });
    });
  });
});
