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

  $("#createRoom").hide();
  $(".search-box").hide();
});
