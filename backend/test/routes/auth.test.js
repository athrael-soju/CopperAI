import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import app from "../../src/app.js";
import User from "../../src/models/User.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /auth/register", () => {
    it("should create a new user and return a 201 status", async () => {
      const userPayload = {
        username: "testUser",
        email: "test@example.com",
        birthdate: "1990-01-01",
        password: "testPassword",
      };

      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(bcrypt, "hash").resolves("hashedPassword");
      sinon.stub(mongoose.Model.prototype, "save").resolves();

      const res = await chai
        .request(app)
        .post("/auth/register")
        .send(userPayload);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("User created successfully.");
    });

    it("should return a 400 status if the user or email already exists", async () => {
      const userPayload = {
        username: "testUser",
        email: "test@example.com",
        birthdate: "1990-01-01",
        password: "testPassword",
      };

      sinon.stub(User, "findOne").resolves(new User(userPayload));

      const res = await chai
        .request(app)
        .post("/auth/register")
        .send(userPayload);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("User or email already exists.");
    });
  });

  describe("POST /auth/login", () => {
    it("should log in the user and return a 200 status", async () => {
      const userPayload = {
        username: "testUser",
        password: "testPassword",
      };

      const user = new User({
        username: userPayload.username,
        email: "test@example.com",
        birthdate: "1990-01-01",
        password: "hashedPassword",
      });

      sinon.stub(User, "findOne").resolves(user);
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("fakeJWT");
      sinon.stub(mongoose.Model.prototype, "save").resolves();

      const res = await chai.request(app).post("/auth/login").send(userPayload);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("User logged in successfully");
      expect(res.body.token).to.equal("fakeJWT");
      expect(res.body.username).to.equal(userPayload.username);
    });

    it("should return a 400 status if the user is not found", async () => {
      const userPayload = {
        username: "testUser",
        password: "testPassword",
      };

      const findOneStub = sinon.stub(User, "findOne");
      findOneStub.withArgs({ username: userPayload.username }).resolves(null);

      const res = await chai.request(app).post("/auth/login").send(userPayload);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("User not found");
    });

    it("should return a 400 status if the password is invalid", async () => {
      const userPayload = {
        username: "testUser",
        password: "testPassword",
      };

      const user = new User({
        username: userPayload.username,
        email: "test@example.com",
        birthdate: "1990-01-01",
        password: "hashedPassword",
      });

      const findOneStub = sinon.stub(User, "findOne");
      findOneStub.withArgs({ username: userPayload.username }).resolves(user);
      sinon.stub(bcrypt, "compare").resolves(false);

      const res = await chai.request(app).post("/auth/login").send(userPayload);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid credentials");
    });
  });
});
