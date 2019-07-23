var express = require("express");
var router = express.Router();
var indexController = require("../controllers/index.controller");

// middleware function to check for logged-in users
var loginChecker = (req, res, next) => {
  if (req.session.userData && req.cookies.user_sid && req.session.isLogin) {
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

// just mocking
router.get("/lounge", loginChecker, (req, res, next) => {
  res.send(req.session.userData);
});

module.exports = router;
