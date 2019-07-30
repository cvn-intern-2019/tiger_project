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
    $("#listPlayers").toggle("fast");
  });

  const option = {
    // reconnection: false
  };
  var socket = io("/room", option);
  var idRoom = $(`#idRoom`).text();
  var username = $(`#username`).text();

  socket.emit("joinRoom", { idRoom: idRoom, username: username });

  socket.on("joinRoom", data => {
    let listPlayerTag = $(`#listPlayers`);
    let receiverTag = $(`#receiverSelect`);
    let playerChild = ``;
    let optionChild = `<option value="all">All</option>`;
    listPlayerTag.empty();
    receiverTag.empty();
    data.player.forEach(p => {
      playerChild += `<h5 class="list-group-item list-group-item-action">
                    <img src="${
                      p.avatar == undefined
                        ? "http://placehold.it/30"
                        : `/avatar/${p.avatar}`
                    }" width="30px" height="30px"/>
                    ${p.username}
                    ${p.isHost ? `<i class="float-right fas fa-crown"/>` : ""}
                    </a>`;
      if (p.username != $(`#username`).text())
        optionChild += `<option value="${p.username}">${p.username}</option>`;
    });
    listPlayerTag.append(playerChild);
    receiverTag.append(optionChild);
    console.log(data);
  });

  $("#messageText").keypress(function(event) {
    if (event.keyCode == 13 || event.which == 13) {
      var $newMessage = $("#messageBox"),
        newMessageText = $("#messageText").val();

      $newMessage.append(
        "<i class='fa fa-user mr-2' id='avatar' aria-hidden='true'></i>"
      );
      $newMessage.append(username);
      $newMessage.append("   ");
      $newMessage.append(newMessageText);

      $("#messageText").val("");
    }
  });
});
