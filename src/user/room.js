const $ = require("jquery");

$(document).ready(() => {
  $("#createRoom").hide();
  $(".search-box").hide();

  
  // $("#close-sidebar").click(function() {
  //   $(".component").removeClass("toggled");
  // });
  $("#show-sidebar").click(function() {
    $("#listPlayers").toggle('slow');
  });

  
});
