var express = require("express");
var profileController = require("../controllers/user/profile.controller")
var roomController = require("../controllers/user/room.controller");
var loginChecker = require('./index').loginChecker;

var router = express.Router();
var profileController = require("../controllers/user/profile.controller");
var loginChecker = require("../routes/index").loginChecker;
var roomController = require("../controllers/user/room.controller");


//require check login for all routes.
router.use(loginChecker);

router.get('/', profileController.getProfilePage);


module.exports = router;
