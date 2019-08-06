var User = require("../../models/user.model");
var History = require("../../models/history.model");
var moment = require("moment");
var multer = require("multer");
var helper = require("../helper");
var upload = multer({ storage });

module.exports.getProfilePage = (req, res, next) => {
  let userId = req.session.userId;
  User.findById(
    userId,
    "username email avatar fullname phone gender birthday",
    (err, data) => {
      if (err) next(err);
      let csrfToken = helper.generateToken();
      req.session.csrfToken = csrfToken;

      History.find({ "players.username": data.username }, (err, histories) => {
        if (err) next(err);
        gfs.exist({ filename: data.avatar, root: "avatars" }, (err, found) => {
          if (err) return next(err);
          if (found)
            res.render("user/profile", {
              userData: data,
              username: req.session.username,
              csrfToken: csrfToken,
              histories: histories
            });
          else {
            data.avatar = undefined;
            res.render("user/profile", {
              userData: data,
              username: req.session.username,
              csrfToken: csrfToken,
              histories: histories
            });
          }
        });
      });
    }
  );
};

var validateInput = (req, res, next) => {
  let body = req.body;
  let csrfToken = helper.generateToken();
  const fullnameRegEx = /^[a-zA-Z\u00c0-\u1ef9 ]{1,50}$/;
  const genderRegEx = /^(true|false)$/;
  const phoneRegEx = /^[0-9]{4,13}$/;
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

var deleteOldAvatar = (req, res, next) => {
  gfs.remove({ filename: req.session.username, root: "avatars" }, err => {
    if (err) next(err);
    next();
  });
};

module.exports.changeAvatar = [
  deleteOldAvatar,
  upload.single("avatarFile"),
  (req, res, next) => {
    let username = req.session.username;
    let userId = req.session.userId;
    User.findByIdAndUpdate(userId, { avatar: username }, err => {
      if (err) next(err);
      res.redirect("/user");
    });
  }
];

module.exports.urlAvatar = (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
};

module.exports.postAddFriends = (req, res, next) => {
  let userId = req.session.userId;
  let friendUsername = req.body.username;

  User.findOne({ username: friendUsername }, (err, friend) => {
    if (err) next(err);
    if (friend == undefined) res.json({ type: 0, msg: "Friend not exists" });
    else
      User.findById(userId, async (err, user) => {
        if (err) next(err);
        let index = user.friendId.findIndex(f => {
          return f.toString() === friend._id.toString();
        });
        if (index < 0) {
          user.friendId.push(friend._id);
          await user.save();
          res.redirect(friend.username);
        } else {
          res.json({ type: 0, msg: "Friend already!" });
        }
      });
  });
};

module.exports.getUserPage = (req, res, next) => {
  let friendUsername = req.params.username;
  if (friendUsername == req.session.username) return res.redirect("/user");
  let userId = req.session.userId;

  User.findOne({ username: friendUsername }, (err, friend) => {
    if (err) next(err);

    if (!friend) return res.render("error");

    User.findById(userId, (err, user) => {
      if (err) next(err);
      let index = user.friendId.findIndex(f => {
        return f.toString() === friend._id.toString();
      });
      if (index < 0) {
        res.render("user/profileFriend", {
          userData: friend,
          username: req.session.username,
          isFriend: false
        });
      } else {
        res.render("user/profileFriend", {
          userData: friend,
          username: req.session.username,
          isFriend: true
        });
      }
    });
  });
};

module.exports.changePassword = (req, res, next) => {
  let body = req.body;
  let csrfToken = helper.generateToken();
  let idUser = req.session.userId;

  //check csrf token
  if (body.csrfToken !== req.session.csrfToken || body.csrfToken == undefined) {
    req.session.csrfToken = csrfToken;
    return res.json({
      type: 0,
      csrfToken: csrfToken,
      msg: " Session is invalid"
    });
  }

  User.findById(idUser, "username password", (err, dataSavedInDB) => {
    if (err) next(err);

    var hashedCurrentPassword = helper.hashPassword(
      dataSavedInDB.username,
      body.currentPassword
    );

    if (hashedCurrentPassword !== dataSavedInDB.password) {
      req.session.csrfToken = csrfToken;
      return res.json({
        type: 0,
        csrfToken: csrfToken,
        msg: "The current password is wrong!"
      });
    }

    if (
      helper.Password(dataSavedInDB.username, body.newPassword) ==
      hashedCurrentPassword
    ) {
      req.session.csrfToken = csrfToken;
      return res.json({
        type: 0,
        csrfToken: csrfToken,
        msg: "The new password is not the same as the old password!"
      });
    }

    if (body.password.length < 5 || body.password.length > 20) {
      return res.json({
        type: 0,
        csrfToken: csrfToken,
        msg: "Your password must have length 5 - 20 characters!"
      });
    }

    //check password and retype is match
    if (body.newPassword !== body.confirmPassword) {
      req.session.csrfToken = csrfToken;
      return res.json({
        type: 0,
        csrfToken: csrfToken,
        msg: "Your new password and comfirm password mismatch!"
      });
    }

    dataSavedInDB.password = helper.hashPassword(
      dataSavedInDB.username,
      body.newPassword
    );

    dataSavedInDB.save(err => {
      if (err) return err;
      req.session.csrfToken = csrfToken;
      res.json({
        type: 1,
        csrfToken: csrfToken,
        msg: "Password is saved!."
      });
    });
  });
};

module.exports.addHistory = (gameLog, result) => {
  let playerList = new Array();

  gameLog.characterRole.forEach(c => {
    playerList.push({ username: c.username, character: c.character.name });
  });

  let history = new History({
    timeStart: gameLog.timeStart,
    timeFinish: gameLog.timeFinish,
    result: result,
    players: playerList,
    details: gameLog.log
  });

  history.save();
};
