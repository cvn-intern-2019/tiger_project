var crypto = require("crypto");
var User = require("../models/user.model");

var generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

var hashPassword = (username, password) => {
  let secret = `${username}${password}`
    .toUpperCase()
    .split("")
    .reverse()
    .join();
  return crypto
    .createHmac("SHA256", secret)
    .update(password)
    .digest("hex");
};

//===============================================================================
// Handle GET - POST login page
module.exports.index = (req, res, next) => {
  res.redirect("/login");
};

module.exports.getLogin = (req, res, next) => {
  if (!req.session.isLogin) return res.render("login", { errMsg: undefined });
  res.redirect("/lounge");
};

module.exports.postLogin = (req, res, next) => {
  let body = req.body;
  let regExp = new RegExp(/[-!$%^&*()_+|~=`{@#}\[\]:";'<>?,.\/]/, "g");

  if (regExp.test(body.username) || regExp.test(body.password)) {
    return res.json({
      type: 0,
      msg: "Your input must alphabetic character or number!"
    });
  }

  User.findOne({ username: body.username }, (err, user) => {
    if (err) next(err);
    else {
      if (user == undefined) {
        return res.json({
          type: 0,
          msg: "Account does not exist!"
        });
      }

      if (hashPassword(body.username, body.password) !== user.password) {
        return res.json({
          type: 0,
          msg: "Your username or password is invalid!"
        });
      }

      req.session.userData = user;

      res.json({
        type: 1
      });
    }
  });
};

module.exports.postRegister = (req, res, next) => {
  let body = req.body;
  let regExp = new RegExp(/[-!$%^&*()_+|~=`{@#}\[\]:";'<>?,.\/]/, "g");

  if (
    regExp.test(body.username) ||
    regExp.test(body.password) ||
    regExp.test(body.confirmPassword)
  ) {
    return res.json({
      type: 0,
      msg: "Your input must alphabetic character or number!"
    });
  }

  if (body.username.length < 5 || body.username.length > 20) {
    return res.json({
      type: 0,
      msg: "Username must have length 5 - 20 characters!"
    });
  }

  if (body.password.length < 5 || body.password.length > 20) {
    return res.json({
      type: 0,
      msg: "Password must have length 5 - 20 characters!"
    });
  }

  if (body.password !== body.confirmPassword) {
    return res.json({
      type: 0,
      msg: "Confirm password not match!"
    });
  }

  User.findOne({ username: body.username }, async (err, user) => {
    if (err) next(err);
    else {
      if (user != undefined) {
        return res.json({
          type: 0,
          msg: "Account already exists!"
        });
      } else {
        let newUser = new User({
          username: body.username,
          password: hashPassword(body.username, body.password)
        });

        await newUser.save();

        res.json({
          type: 1,
          msg: "Register success!"
        });
      }
    }
  });
};
