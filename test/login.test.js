const User = require("../models/user.model");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
});

// POST /login method testing
describe("POST /", () => {
  it("should your input must alphabetic character or number!", async () => {
    const user = new User({
      username: "<>",
      password: "123456789"
    });
    //await user.save();

    await chai.request(app)
      .post('/login')
      .send(user)
      .then(res => {
        expect(res.body).to.have.property('msg', 'Your input must alphabetic character or number!')
      })
      .catch(err => {
        expect(err).to.be.null;
      });
  });

  it("should account does not exist!", async () => {
    const user = new User({
      username: "duy",
      password: "123456789"
    });
    //await user.save();

    await chai.request(app)
      .post('/login')
      
      .send(user)
      .then(res => {
        expect(res.body).to.have.property('msg', 'Account does not exist!')
      })
      .catch(err => {
        expect(err).to.be.null;
      });
  });

  it("should your username or password is invalid!", async () => {
    const user = new User({
      username: "duytrinh",
      password: "123456789"
    });
    await user.save();

    await chai.request(app)
      .post('/login')
      .send(user)
      .then(res => {
        expect(res.body).to.have.property('msg', 'Your username or password is invalid!')
      })
      .catch(err => {
        expect(err).to.be.null;
      });
  });

  it('should redirect to lounge page', async () => {
    const user = new User({
        username: "poon",
        password: "123"
    });
     await chai.request(app)
       .post('/login')
       .send(user)
       .then(res => {
         expect(res.body).to.have.property('type', 1)
       })
       .catch(err => {
         expect(err).to.be.null;
       });
  });
});
