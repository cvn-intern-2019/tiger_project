var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var User = require("../models/user.model");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

//===============================================================================
// Handle GET - POST login page
var generateToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// var setCookie = (req, res, next) => {
//   var cookie = req.cookies.cookieName;
//   if (cookie === undefined) {
//     // no: set a new cookie
//     var randomNumber = Math.random().toString();
//     randomNumber = randomNumber.substring(2, randomNumber.length);
//     res.cookie("token", randomNumber, {
//       maxAge: 1000 * 60 * 5
//     });
//   } else {
//     // yes, cookie was already present
//     console.log("cookie exists", cookie);
//   }
//   next();
// };

router.get("/login", (req, res, next) => {
  if (req.session.isLogin) return res.redirect("/lounge");

  let csrfToken = generateToken();
  req.session.csrfToken = csrfToken;
  res.render("login", { csrfToken: csrfToken, errMsg: undefined });
});

router.post("/login", (req, res, next) => {
  let body = req.body;
  let csrfToken = generateToken();
  let regExp = new RegExp(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/, "g");

  if (regExp.test(body.username) || regExp.test(body.password)) {
    req.session.csrfToken = csrfToken;
    return res.render("login", {
      csrfToken: csrfToken,
      errMsg: "Your input must alphabetic character or number!"
    });
  }

  if (body.csrfToken !== req.session.csrfToken) {
    req.session.csrfToken = csrfToken;
    return res.render("login", {
      csrfToken: csrfToken,
      errMsg: "Session is invalid!"
    });
  }

  User.findOne({ username: body.username }, (err, user) => {
    if (err) next(err);
    else {
      if (user == undefined) {
        req.session.csrfToken = csrfToken;
        return res.render("login", {
          csrfToken: csrfToken,
          errMsg: "Account does not exist!"
        });
      }

      if (body.password !== user.password) {
        req.session.csrfToken = csrfToken;
        return res.render("login", {
          csrfToken: csrfToken,
          errMsg: "Your username or password is invalid!"
        });
      }
      req.session.isLogin = true;
      req.session.userId = user._id;
      res.redirect("/lounge");
    }
  });
});

module.exports = router;
