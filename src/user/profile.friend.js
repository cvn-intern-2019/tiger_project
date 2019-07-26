const $ = require("jquery");

$(document).ready(() => {
  $("#createRoom ").hide();
  $(".search-box").hide();
  $("#changeAvatar").hide();

  $(`#addfriends`).mousedown(event => {
    if (event.which == true) {
      $("addfriends").hide();
    }
  });
});
