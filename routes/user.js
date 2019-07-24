var express = require("express");
var profileController = require("../controllers/user/profile.controller")
var roomController = require("../controllers/user/room.controller");
var loginChecker = require('./index').loginChecker;

var router = express.Router();

//require check login for all routes.
router.use(loginChecker);

router.get('/', profileController.getUserPage);

router.post("/", profileController.postEditProfile);

router.get("/room", roomController.getRoomPage);


module.exports = router;
