var crypto = require("crypto");
var User = require("../models/user.model");
const usernameRegEx = /^[a-z]/;
const userRegEx = /^[a-z0-9]*$/;
const emailRegEx = /^[a-z][a-z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

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
  if (!req.session.userId || !req.cookies.user_sid)
    return res.render("login", { errMsg: undefined });
  res.redirect("/lounge");
};

module.exports.postLogin = (req, res, next) => {
  let body = req.body;
  if (userRegEx.test(body.username) === false) {
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

  if (usernameRegEx.test(body.username) === false) {
    return res.json({
      type: 0,
      msg: "First character of username must be a alphabetic character!"
    });
  }

  if (userRegEx.test(body.username) === false) {
    return res.json({
      type: 0,
      msg: "Your username "
    });
  }

  if (body.username.length < 5 || body.username.length > 20) {
    return res.json({
      type: 0,
      msg: "Username must have length 5 - 20 characters!"
    });
  }

  if (emailRegEx.test(body.email) === false) {
    return res.json({
      type: 0,
      msg: "Your email is invalid!"
    });
  }

  if (body.password.length < 5 || body.password.length > 20) {
    return res.json({
      type: 0,
      msg: "Your password must have length 5 - 20 characters!"
    });
  }

  if (body.password !== body.confirmPassword) {
    return res.json({
      type: 0,
      msg: "Your confirm password not match!"
    });
  }

  User.findOne({ username: body.username }, (err, user) => {
    if (err) next(err);
    if (user != undefined) {
      return res.json({
        type: 0,
        msg: "Your username already exists!"
      });
    }
  });

  User.findOne({ email: body.email }, (err, user) => {
    if (err) next(err);
    if (user != undefined) {
      return res.json({
        type: 0,
        msg: "Your email already exists!"
      });
    }
  });
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
};

module.exports.getLogout = (req, res, next) => {
  res.clearCookie("user_sid");
  res.redirect("/");
};

module.exports.hashPassword = hashPassword;
