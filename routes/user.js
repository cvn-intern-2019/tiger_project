var express = require("express");
var profileController = require("../controllers/user/profile.controller")
var roomController = require("../controllers/user/room.controller");

var router = express.Router();


router.get("/", profileController.getProfilePage);
router.get("/edit", profileController.getEditProfilePage);
router.post("/edit", profileController.postEditProfile);

router.get("/room", roomController.getRoomPage);


module.exports = router;
