var express = require("express");
var router = express.Router();
var profileController = require("../controllers/user/profile.controller");
var loginChecker = require("../routes/index").loginChecker;
var roomController = require("../controllers/user/room.controller");

//router.use(loginChecker);

router.get("/", profileController.getProfilePage);

router.post("/edit", profileController.postEditProfile);

router.post("/password/update", profileController.changePassword);

router.get("/room", roomController.getRoomPage);

module.exports = router;
