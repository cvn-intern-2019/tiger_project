var crypto = require("crypto");
var User = require("../models/user.model");
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
  if (!req.session.userData || !req.cookies.user_sid)
    return res.render("login", { errMsg: undefined });
  res.redirect("/lounge");
};

module.exports.postLogin = (req, res, next) => {
  let body = req.body;
  if (
    userRegEx.test(body.username) === false ||
    userRegEx.test(body.password) === false
  ) {
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

// Transaction register account
var registerTransaction = async user => {
  //init session
  let session = await User.startSession();
  try {
    //start transaction
    session.startTransaction();

    //every action here
    await user.save({ session });

    //commit
    await session.commitTransaction();
    return true;
  } catch (err) {
    console.log(err);
    //fail -> abort transaction and return false
    await session.abortTransaction();
    session.endSession();
    return false;
  }
};

module.exports.postRegister = (req, res, next) => {
  let body = req.body;

  if (
    userRegEx.test(body.username) === false ||
    userRegEx.test(body.password) === false ||
    userRegEx.test(body.confirmPassword) === false
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

  User.findOne({ email: body.email }, async (err, user) => {
    if (err) next(err);
    if (user != undefined) {
      return res.json({
        type: 0,
        msg: "Your email already exists!"
      });
    } else {
      let newUser = new User({
        username: body.username,
        email: body.username,
        password: hashPassword(body.username, body.password)
      });

      if (await registerTransaction(newUser)) {
        res.json({
          type: 1,
          msg: "Register success!"
        });
      } else {
        res.json({
          type: 0,
          msg: "Register error (DB)!"
        });
      }
    }
  });
};
