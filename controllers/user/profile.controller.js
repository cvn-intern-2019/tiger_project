var User = require("../../models/user.model");
var crypto = require("crypto");
var moment = require("moment");

var generateToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

module.exports.getProfilePage = (req, res, next) => {
    let idUser = req.session.userData;
    
    User.findById(idUser, "username email avatar fullname phone gender birthday",(err,userData)=>{
        if(err) return next(err);
        if(!userData) return next(new NotFound);
        
        //convert date to string and display in format DD-MM-YYYY
        userData.birthday_formatted = moment(userData.birthday).format("DD-MM-YYYY");

        res.render("user/profile", {
            title: "View user page",
            userData: userData,
        });
    })

};

module.exports.getEditProfilePage = (req, res, next) => {
    res.render("profile_edit", {
        title: "Edit your profile",
        userData: userData
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
