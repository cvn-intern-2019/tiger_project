var User = require("../../models/user.model");
var crypto = require("crypto");
var moment = require("moment");

var generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports.getProfilePage = (req, res, next) => {
  res.render("profile", {
    title: "View your profile"
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

module.exports.postEditProfile = (req, res, next) => {
  let userId = req.session.userData._id;
  let body = req.body;
  let csrfToken = generateToken();
  const fullnameRegEx = /^[a-zA-Z\u00c0-\u1ef9 ]{5,50}$/;
  const genderRegEx = /^(true|false)$/;
  const emailRegEx = /^[a-z][a-z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
  const phoneRegEx = /^[0-9]{10,10}$/;
  //   const addressRegEx = /^[0-9a-zA-Z\u00c0-\u1ef9 ,]*$/;
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

  if (emailRegEx.test(body.email) === false) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: "Your email is invalid!"
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

  let data = {
    fullname: body.fullname,
    gender: body.gender,
    email: body.email,
    phone: body.phone,
    birthday: new Date(body.birthday)
  };

  User.find({ email: body.email }, async (err, user) => {
    if (err) next(err);
    if (user != undefined) {
      req.session.csrfToken = csrfToken;
      return res.json({
        type: 0,
        csrfToken: csrfToken,
        msg: "Your email already exists!"
      });
    }

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
  });
};
