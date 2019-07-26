import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery.slim";
import "../user/animate.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import { addFriends } from "../../controllers/user/profile.controller";
const $ = require("jquery");
const editProfile = require("./profile.edit");

$(document).ready(() => {
  $(`#edit #msg`).hide();

  $(`#edit #editSubmit`).mousedown(event => {
    if (event.which == 1) {
      editProfile.editBtnEvent();
    }
  });

  // $(`#addfriends`).mousedown(event => {
  //   if (event.which == 1) {
  //     console.log("abc");
  //     $(`#frmAddfriends #addfriends`).attr("disabled", true);
  
  //     let input = {
  //       friendId: $(`#frmAddfriends input[name=username]`).val()
  //     };
      
  //     $.post("/user/addfriends", input)
  //   }
  // });
});
