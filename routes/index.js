var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var User = require("../models/user.model");
var crypto = require("crypto");

/* GET home page. */
router.get("/", (req, res, next) => {
  if (req.session.isLogin) return res.redirect("/lounge");
  res.redirect("/login");
});

//===============================================================================
// Handle GET - POST login page
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

router.get("/login", (req, res, next) => {
  if (req.session.isLogin) return res.redirect("/lounge");

  let csrfToken = generateToken();
  req.session.csrfToken = csrfToken;
  res.render("login", { csrfToken: csrfToken, errMsg: undefined });
});

router.post("/login", (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
  let regExp = new RegExp(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/, "g");

  if (regExp.test(body.username) || regExp.test(body.password)) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your input must alphabetic character or number!"
    });
  }

  if (body.csrfToken !== req.session.csrfToken) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Session is invalid!"
    });
  }

  User.findOne({ username: body.username }, (err, user) => {
    if (err) next(err);
    else {
      if (user == undefined) {
        req.session.csrfToken = csrfToken;
        return res.json({
          type: 0,
          csrfToken: csrfToken,
          msg: "Account does not exist!"
        });
      }
      console.log(hashPassword(body.username, body.password));
      if (hashPassword(body.username, body.password) !== user.password) {
        req.session.csrfToken = csrfToken;
        return res.json({
          type: 0,
          csrfToken: csrfToken,
          msg: "Your username or password is invalid!"
        });
      }
      req.session.isLogin = true;
      req.session.userId = user._id;
      res.json({
        type: 1
      });
    }
  });
});

router.post("/register", (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
  let regExp = new RegExp(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/, "g");

  if (
    regExp.test(body.username) ||
    regExp.test(body.password) ||
    regExp.test(body.confirmPassword)
  ) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your input must alphabetic character or number!"
    });
  }

  if (body.csrfToken !== req.session.csrfToken) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Session is invalid!"
    });
  }

  if (body.username.length < 5 || body.username.length > 20) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Username must have length 5 - 20 characters!"
    });
  }

  if (body.password.length < 5 || body.password.length > 20) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Password must have length 5 - 20 characters!"
    });
  }

  if (body.password !== body.confirmPassword) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Confirm password not match!"
    });
  }

  User.findOne({ username: body.username }, async (err, user) => {
    if (err) next(err);
    else {
      if (user != undefined) {
        req.session.csrfToken = csrfToken;
        return res.json({
          type: 0,
          csrfToken: csrfToken,
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
          csrfToken: csrfToken,
          msg: "Register success!"
        });
      }
    }
  });
});

module.exports = router;
