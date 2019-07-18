var express = require('express');
var router = express.Router();
var ManageProfileController = require('../controllers/ManageProfileController')

/* GET users listing. */
router.get('/', ManageProfileController.getProfilePage);
router.get('/edit', ManageProfileController.getProfileUpdatePage);

module.exports = router;
