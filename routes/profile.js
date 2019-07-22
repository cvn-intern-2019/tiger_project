var express = require("express");
var router = express.Router();
var profileControlleer = require("../controllers/profileController");


router.get("/", profileControlleer.getProfilePage);
router.get("/edit", profileControlleer.getProfileEditPage);
router.post("/edit", profileControlleer.postProfileEdit);


module.exports = router;
