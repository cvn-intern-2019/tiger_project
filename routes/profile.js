var express = require("express");
var router = express.Router();
var profileController = require('../controllers/profile.controller')

/* GET home page. */
router.get("/", profileController.getProfilePage);
router.get("/edit", profileController.getEditProfilePage);
router.post("/edit", profileController.postEditProfile);

module.exports = router;
