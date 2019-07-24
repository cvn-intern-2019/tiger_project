var express = require("express");
var loungeController = require("../controllers/lounge.controller");

var router = express.Router();
var indexController = require("../controllers/index.controller");

// middleware function to check for logged-in users
var loginChecker = (req, res, next) => {
  if (req.session.userData && req.cookies.user_sid) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", indexController.index);

router.get("/login", indexController.getLogin);

router.post("/login", indexController.postLogin);

router.post("/register", indexController.postRegister);

router.get("/logout", indexController.getLogout);

router.get("/lounge", loginChecker, loungeController.getRoomPage);

module.exports = router;
module.exports.loginChecker = loginChecker;