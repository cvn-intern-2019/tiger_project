import "../user/animate.css";
const $ = require("jquery");
const editProfile = require("./profile.edit");

$(document).ready(() => {
  $(`#edit #msg`).hide();

  $(`#edit #editSubmit`).mousedown(event => {
    if (event.which == 1) {
      editProfile.editBtnEvent();
    }
  });

  $("#changePasswordForm").submit(function(e) {
    e.preventDefault();
    $("#changePasswordBtn").disable = true;

    changePassword.ajaxChangePassword();
  });

  $("#changePasswordBtn").click(function(e) {
    e.preventDefault();
    $("#changePasswordBtn").disable = true;

    editProfile.changePasswordEvent();
  });
  $("#createRoom").hide();
  $(".search-box").hide();
});
