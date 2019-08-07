var crypto = require("crypto");
var User = require("../models/user.model");
var helper = require("./helper");
var request = require("request");
var hashPassword = helper.hashPassword;
const CAPTCHA = require("./captcha.config").captcha;
const validateUser = require("./validate.helper");
var async = require("async");

//===============================================================================
// Handle GET - POST login page
module.exports.index = (req, res, next) => {
  res.redirect("/login");
};

module.exports.getLogin = (req, res, next) => {
  if (!req.session.userId || !req.cookies.user_sid)
    return res.render("login", { errMsg: undefined });
  res.redirect("/lounge");
};

module.exports.postLogin = (req, res, next) => {
  let body = req.body;
  if (!validateUser.validateUsername(body.username)) {
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

      if (
        !validateUser.checkMatch(
          hashPassword(body.username, body.password),
          user.password
        )
      ) {
        return res.json({
          type: 0,
          msg: "Your username or password is invalid!"
        });
      }

      req.session.userId = user._id;
      req.session.username = user.username;

      res.json({
        type: 1
      });
    }
  });
};

module.exports.postRegister = (req, res, next) => {
  let body = req.body;

  if (!validateUser.validateCaptchaNull(body.captcha)) {
    return res.json({
      type: 0,
      msg: "No catcha token in request. Please refresh the page."
    });
  }

  captchaLink = `https://www.google.com/recaptcha/api/siteverify?secret=${
    CAPTCHA.sekret
  }&response=${body.captcha}`;

  request.post(captchaLink, (error, response, content) => {
    content = JSON.parse(content);
    console.log(content);
    if (body.success == false) {
      return res.json({
        type: 0,
        msg: "Captcha is invalid. Please refresh page."
      });
    }
  });

  if (!validateUser.validateFirstCharOfUsername(body.username)) {
    return res.json({
      type: 0,
      msg: "First character of username must be a alphabetic character!"
    });
  }

  if (!validateUser.validateUsername(body.username)) {
    return res.json({
      type: 0,
      msg: "Your username is invalid!"
    });
  }

  if (!validateUser.validateMaxLengthUsername(body.username)) {
    return res.json({
      type: 0,
      msg: "Username must have length 5 - 20 characters!"
    });
  }

  if (!validateUser.validateEmail(body.email)) {
    return res.json({
      type: 0,
      msg: "Your email is invalid!"
    });
  }

  if (!validateUser.checkMatch(body.password, body.confirmPassword)) {
    return res.json({
      type: 0,
      msg: "Your confirm password not match!"
    });
  }

  async.parallel(
    {
      usernameFound: function(callback) {
        User.find({ username: body.username }, callback);
      },
      emailFound: function(callback) {
        User.find({ email: body.email }, callback);
      }
    },
    (err, data) => {
      if (err) next(err);

      if (data.usernameFound.length > 0) {
        return res.json({
          type: 0,
          msg: "Username is existed"
        });
      }
      if (data.emailFound.length > 0) {
        return res.json({
          type: 0,
          msg: "Email is exists"
        });
      }
      let newUser = new User({
        username: body.username,
        email: body.email,
        password: hashPassword(body.username, body.password)
      });
      newUser.save(err => {
        if (err) return err;
        return res.json({
          type: 1
        });
      });
    }
  );
};

module.exports.getLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.clearCookie("user_sid").redirect("/");
  });
};

module.exports.hashPassword = hashPassword;
