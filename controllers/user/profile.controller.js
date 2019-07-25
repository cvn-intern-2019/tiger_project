var User = require("../../models/user.model");
var crypto = require("crypto");
var moment = require("moment");
var multer = require("multer");
var mongoose = require("mongoose");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");

// Mongo URI
const mongoURI =
  "mongodb+srv://tiger:tiger@cluster-werewolf-qiefh.gcp.mongodb.net/werewolf?retryWrites=true&w=majority";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
// Init gfs
var gfs;
conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("avatars");
});
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = req.session.userId;
      const fileInfo = {
        filename: filename,
        bucketName: "avatars"
      };
      resolve(fileInfo);
    });
  }
});
const upload = multer({ storage });

var generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports.getProfilePage = (req, res, next) => {
  let userId = req.session.userId;

  User.findById(
    userId,
    "username email avatar fullname phone gender birthday",
    (err, data) => {
      if (err) next(err);

      let csrfToken = generateToken();
      req.session.csrfToken = csrfToken;
      gfs.exist({ filename: data.avatar, root: "avatars" }, (err, found) => {
        if (err) return next(err);
        if (found)
          res.render("user/profile", {
            userData: data,
            csrfToken: csrfToken
          });
        else {
          data.avatar = undefined;
          res.render("user/profile", {
            userData: data,
            csrfToken: csrfToken
          });
        }
      });
    }
  );
};

var validateInput = (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
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
  gfs.remove({ filename: req.session.userId, root: "avatars" }, err => {
    if (err) next(err);
    next();
  });
};
module.exports.changeAvatar = [
  deleteOldAvatar,
  upload.single("avatarFile"),
  (req, res, next) => {
    let userId = req.session.userId;
    User.findByIdAndUpdate(userId, { avatar: userId }, err => {
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
