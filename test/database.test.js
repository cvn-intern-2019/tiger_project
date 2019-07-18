const chai = require("chai");
const expect = chai.expect;
const mongoose = require("mongoose");
const User = require("../models/user.model");
const History = require("../models/history.model");
const Character = require("../models/character.model");

describe("Database Testing:", () => {
  it("should connected with DB", () => {
    mongoose.connect("mongodb://localhost/werewolf", { useNewUrlParser: true });
    mongoose.connection.on("error", err => {
      expect(err).to.be.null;
    });
  });
});
