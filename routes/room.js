var express = require("express");
var router = express.Router();
var roomController = require("../controllers/user/room.controller");

router.get("/:id", roomController.getRoomPage);

module.exports = router;
