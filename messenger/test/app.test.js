import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("app", () => {
  it("should check if the server is running", () => {
    chai
      .request(app)
      .get("/")
      .then((err, res) => {
        expect(res.body.message).to.equal(
          `You've reached the messenger server, running on port ${process.env.SERVER_PORT}`
        );
      });
  });

  it("should check if the /auth route is running", () => {
    chai
      .request(app)
      .get("/auth")
      .then((err, res) => {
        expect(res.body.message).to.equal(
          `You've reached the /auth server route, running on port ${process.env.SERVER_PORT}`
        );
      });
  });

  it("should check if the /message route is running", () => {
    chai
      .request(app)
      .get("/message")
      .then((err, res) => {
        expect(res.body.message).to.equal(
          `You've reached the /message server route, running on port ${process.env.SERVER_PORT}`
        );
      });
  });

  it("should check if the /speak route is running", () => {
    chai
      .request(app)
      .get("/speak")
      .then((err, res) => {
        expect(res.body.message).to.equal(
          `You've reached the /speak server route, running on port ${process.env.SERVER_PORT}`
        );
      });
  });
});
