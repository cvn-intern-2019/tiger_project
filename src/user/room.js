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
    $("#listPlayers").toggle("slow");
  });

  const option = {
    // reconnection: false
  };
  var socket = io("/room", option);
  var idRoom = $(`#idRoom`).text();
  var username = $(`#username`).text();

  socket.emit("joinRoom", { idRoom: idRoom, username: username });

  socket.on("joinRoom", data => {
    console.table(data);
  });

  $('#messageTextRoom').keypress(function(event) {
    if (event.keyCode == 13 || event.which == 13) {
     
      var $newMessage = $("#messageBoxRoom"),
      newMessageText = $('#messageTextRoom').val();

      $newMessage.append("<i class='fa fa-user mr-2' id='avatar' aria-hidden='true'></i>");
      $newMessage.append(username);
      $newMessage.append("   ");
      $newMessage.append(newMessageText);
     
      $("#messageTextRoom").val("");
       }
   });


});
