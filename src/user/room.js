import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery.slim";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "./animate.css";
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
