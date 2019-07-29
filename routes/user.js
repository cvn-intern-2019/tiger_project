var express = require("express");
var router = express.Router();
var profileController = require("../controllers/user/profile.controller");

router.post("/edit", profileController.postEditProfile);

router.get("/", profileController.getProfilePage);

router.get("/:username", profileController.getUserPage);

router.post("/addfriends", profileController.postAddFriends);

router.post("/password/update", profileController.changePassword);

router.post("/change-avatar", profileController.changeAvatar);

module.exports = router;
