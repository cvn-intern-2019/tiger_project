
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


router.get("/", indexController.index);
router.get("/lounge", loginChecker, (req, res, next) => {
  res.send(req.session.userData);
});

module.exports = router;
