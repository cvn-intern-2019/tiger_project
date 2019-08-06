import "./layout";
import "./user/animate.css";
import "./notify";
import "./styleNotify";

const $ = require("jquery");
const game = require("./game-client/game");
const handleEvent = require("./handle.event.room");

window.onbeforeunload = function() {
  return "Leave?";
};

$(document).ready(() => {
  const option = {
    reconnection: false,
    // transports: ["websocket"],
    // upgrade: false,
    query: {
      // token: $(`meta[name=socketAuthToken]`).data("content")
    }
  };
  var socket = io("/room", option);
  var idRoom = $(`#idRoom`)
    .text()
    .trim();
  var username = $(`#username`)
    .text()
    .trim();

  //------------------- EVENT SOCKET -----------------------------
  socket.emit("joinRoom", { idRoom: idRoom, username: username });

  socket.on("initRoom", room => {
    handleEvent.initWaitingRoom(room, socket);
  });

  socket.on("recMsg", data => {
    handleEvent.recMsg(data);
  });

  socket.on("startGame", room => {
    game.init(room, socket);
  });

  //------------------- EVENT USER -----------------------------

  $("#createRoom").hide();
  $(".search-box").hide();
  $(".toast").hide();

  $(`#sendMessage`).mousedown(event => {
    if (event.which == 1) {
      handleEvent.sendMsg(socket);
    }
  });

  $(`.input-group`).keypress(event => {
    if (event.which == 13) {
      handleEvent.sendMsg(socket);
    }
  });

  $(`#tab a`).mousedown(event => {
    if (event.which == 1) {
      $(event.target).removeClass("animated bounce infinite");
    }
  });

  $(`#roomTab`).click(event => {
    if (event.which == 1) {
      $(`#receiverSelect option`).removeAttr("selected");
      $(`#receiverSelect option[value=all]`).prop("selected", true);
    }
  });

  $(`#controllerToggle`).click(event => {
    if (event.which == 1) {
      handleEvent.toggleController(event.target);
    }
  });

  $("#help").click(function() {
    $(".toast")
      .show()
      .toast("show");
  });
});
