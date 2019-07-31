var express = require("express");
var router = express.Router();
var indexController = require("../controllers/index.controller");

/* GET home page. */
router.get("/", indexController.index);

router.get("/login", indexController.getLogin);

router.post("/login", indexController.postLogin);

router.post("/register", indexController.postRegister);

router.post("/logout", indexController.getLogout);

module.exports = router;
