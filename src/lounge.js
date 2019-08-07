import "./layout";
import "./user/animate.css";

const $ = require("jquery");
const handleEvent = require("./handle.event.lounge");

$(document).ready(() => {
  const option = {
    reconnection: false
  };
  var socket = io("/lounge", option);

  //------------------- EVENT SOCKET -----------------------------
  socket.on("listRoom", listRoom => {
    handleEvent.listRoom(listRoom);
  });

  socket.on("createRoom", room => {
    handleEvent.listenCreateRoom(room);
  });

  //disconnect event listen
  // socket.on("disconnect", () => {
  //   alert("Disconnect with server!");
  //   window.location.href = `/`;
  // });

  //------------------- EVENT USER -----------------------------

  $(`#createRoom`).mousedown(event => {
    if (event.which == 1) {
      handleEvent.emitCreateRoom(socket);
    }
  });

  $("#search_input").keyup(handleEvent.searchRoomEvent());
});
