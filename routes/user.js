var express = require("express");
var router = express.Router();
var profileController = require("../controllers/user/profile.controller");
var loginChecker = require("../routes/index").loginChecker;
var roomController = require("../controllers/user/room.controller");

//require check login for all routes.
router.use(loginChecker);

router.post("/edit", profileController.postEditProfile);

router.get("/", profileController.getProfilePage);

router.get("/room", roomController.getRoomPage);

router.get("/:username", profileController.getUserPage);

router.post("/addfriends", profileController.postAddFriends);

router.post("/password/update", profileController.changePassword);

router.get("/room", roomController.getRoomPage);

router.post("/change-avatar", profileController.changeAvatar);

module.exports = router;
