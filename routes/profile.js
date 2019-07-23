var express = require("express");
var router = express.Router();
var profileController = require('../controllers/profile.controller')

/* GET home page. */
router.get("/", profileController.getProfilePage);

module.exports = router;
