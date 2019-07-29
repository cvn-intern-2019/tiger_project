var express = require("express");
var loungeController = require("../controllers/lounge.controller");
var router = express.Router();

router.get("/", loungeController.index);

module.exports = router;
