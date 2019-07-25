import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery.slim";
import "../user/animate.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
const $ = require("jquery");
const editProfile = require("./profile.edit");
const profileController = require("../../controllers/user/profile.controller")

$(document).ready(() => {
  $(`#edit #msg`).hide();

  $(`#edit #editSubmit`).mousedown(event => {
    if (event.which == 1) {
      editProfile.editBtnEvent();
    }
  });

  $(`#addfriends`).mousedown(event => {
     profileController.addFriends();
     console.log("a");
  });
});
