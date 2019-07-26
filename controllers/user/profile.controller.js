var User = require("../../models/user.model");
var crypto = require("crypto");
var moment = require("moment");

var hashPassword = require("../index.controller").hashPassword;

var generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports.getProfilePage = (req, res, next) => {
  console.log(req.session);
  let userId = req.session.userId;

  User.findById(userId, (err, data) => {
    if (err) next(err);

    let csrfToken = generateToken();
    req.session.csrfToken = csrfToken;

    res.render("user/profile", {
      userData: data,
      csrfToken: csrfToken
    });
  });
};

var validateInput = (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
  const fullnameRegEx = /^[a-zA-Z\u00c0-\u1ef9 ]{5,50}$/;
  const genderRegEx = /^(true|false)$/;
  const phoneRegEx = /^[0-9]{10,10}$/;
  const dobRegEx = /^\d{4}(\-)(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])$/;

  if (
    req.session.csrfToken !== body.csrfToken ||
    req.body.csrfToken === undefined
  ) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Session is invalid! Please try again or refresh this page!"
    });
  }

  if (fullnameRegEx.test(body.fullname) === false) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your fullname is invalid!"
    });
  }

  if (genderRegEx.test(body.gender) === false) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your gender is invalid!"
    });
  }

  if (phoneRegEx.test(body.phone) === false) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your phone number is invalid!"
    });
  }

  if (
    dobRegEx.test(body.birthday) === false ||
    moment(new Date()).diff(moment(body.birthday), "days") < 1
  ) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your birthday is invalid!"
    });
  }
  next();
};

module.exports.postEditProfile = [
  validateInput,
  async (req, res, next) => {
    let userId = req.session.userId;
    let body = req.body;
    let data = {
      fullname: body.fullname,
      gender: body.gender,
      phone: body.phone,
      birthday: new Date(body.birthday)
    };

    await User.findByIdAndUpdate(userId, data, err => {
      if (err) {
        res.json({
          type: 0,
          msg: "Update failed (DB)!"
        });
      }
      res.json({
        type: 1
      });
    });
  }
];

const passwordRegEx = /^.{5,20}$/g;

module.exports.changePassword = (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
  let idUser = req.session.userId;
  console.log(req.body);
  console.log(req.session);

  
  //check csrf token
  if (body.csrfToken != req.session.csrfToken || body.csrfToken == undefined) {
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: " Session is invalid"
    });
  }

  //check password and retype is match
  if (body.newPassword != body.confirmPassword) {
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your new password and comfirm password mismatch"
    });
  }


  //test current password match
  console.log(body.currentPassword);
  User.findById(idUser, "password", (err, password) => {
    if (err) next(err);
    if (hashPassword(body.currentPassword) !== password) {
      return res.json({
        type: 0,
        csrfToken: csrfToken,
        msg: "Your current password is wrong."
      });
    }
  });

  User.findByIdAndUpdate(
    idUser,
    { password: hashPassword(body.currentPassword) },
    err => {
      if (err) return next(err);
      return res.json({
        type: 1,
        msg: "Your password is changed."
      });
    }
  );
};
