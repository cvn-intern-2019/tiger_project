const $ = require("jquery");

$(document).ready(() => {
  $("#createRoom").hide();
  $(".search-box").hide();

  
  $("#close-sidebar").click(function() {
    $(".page-wrapper").removeClass("toggled");
  });
  $("#show-sidebar").click(function() {
    $(".page-wrapper").addClass("toggled");
  });

  
});
