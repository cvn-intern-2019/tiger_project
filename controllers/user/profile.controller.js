var User = require("../../models/user.model");
var crypto = require("crypto");
var moment = require("moment");

var generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports.getProfilePage = (req, res, next) => {
  let userData = req.session.userData;
  userData.birthday = moment(userData.birthday).format("YYYY-MM-DD");
  res.render("user/profile", {
    userData: userData
  });
};
module.exports.getEditProfilePage = (req, res, next) => {
  res.render("profile_edit", {
    title: "Edit your profile",
    userData: userData
  });
};

var updateTransaction = async (userId, data) => {
  //init session
  let session = await User.startSession();
  try {
    //start transaction
    session.startTransaction();

    //every action here
    await User.findByIdAndUpdate(userId, data, session);

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

var validateInput = (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
  const fullnameRegEx = /^[a-zA-Z\u00c0-\u1ef9 ]{5,50}$/;
  const genderRegEx = /^(true|false)$/;
  const phoneRegEx = /^[0-9]{10,10}$/;
  const dobRegEx = /^\d{4}(\-)(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])$/;

  //   if (
  //     req.session.csrfToken !== body.csrfToken ||
  //     req.body.csrfToken === undefined
  //   ) {
  //     req.session.csrfToken = csrfToken;
  //     return res.json({
  //       type: 0,
  //       csrfToken: csrfToken,
  //       msg: "Session is invalid! Please try again or refresh this page!"
  //     });
  //   }

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
      msg: "Your date of birth is invalid!"
    });
  }
  next();
};

module.exports.postEditProfile = [
  validateInput,
  async (req, res, next) => {
    let userId = req.session.userData._id;
    let body = req.body;
    let data = {
      fullname: body.fullname,
      gender: body.gender,
      phone: body.phone,
      birthday: new Date(body.birthday)
    };

    if (await updateTransaction(userId, data)) {
      res.json({
        type: 1,
        msg: "Update profile successful!"
      });
    } else {
      res.json({
        type: 0,
        msg: "Update failed (DB)!"
      });
    }
  }
];
