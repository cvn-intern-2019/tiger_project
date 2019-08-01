import "../layout";
import "./animate.css";

const $ = require("jquery");
const moment = require("moment");

$(document).ready(() => {
  const option = {
    reconnection: false
  };
  var socket = io("/room", option);
  var idRoom = $(`#idRoom`).text();
  var username = $(`#username`).text();

  socket.on("recMsg", data => {
    let messageBoxTag = $(`#room`);
    let messageTab = $(`#tab #roomTab`);
    let child = `<div class="my-2">
                    <h5>
                      <img src="/avatar/${data.sender}" 
                      alt=""
                      width="30px" height="30px"/>
                      ${data.sender}:
                    </h5>
                    <span class="badge badge-light float-right">
                      ${moment(new Date()).format("LTS")}</span>
                    <p class="p-2 bg-secondary border border-dark rounded">
                      ${data.msg}
                    </p>
                </div>`;

    if (data.receiver != idRoom) {
      messageBoxTag = $(`#private`);
      messageTab = $(`#tab #privateTab`);
    }
    $($(messageBoxTag).children()[0]).append(child);

    $(`#room, #private`).scrollTop($($(messageBoxTag).children()[0]).height());

    if (!$(messageBoxTag).hasClass("active"))
      messageTab.addClass("animated bounce infinite");
  });

  function sendMessage() {
    let msgTag = $(`#messageText`);
    let pattern = /^[/</>]*$/;
    if (msgTag.val().length == 0 || msgTag.val().length > 255) {
      alert("Message length must be 1-255 characters!");
      return;
    }
    if (pattern.test(msgTag.val()) == true) {
      alert("The message contains invalid characters!");
      return;
    }
    let receiver = idRoom;
    if ($(`#receiverSelect`).val() != "all") {
      receiver = $(`#receiverSelect`).val();
      let messageBoxTag = $(`#messageBoxPrivate`);
      let child = `<div class="my-2">
                    <h5>
                      <img src="/avatar/${username}" 
                      alt=""
                      width="30px" height="30px"/>
                      ${username}:
                    </h5>
                    <span class="badge badge-light float-right">
                      ${moment(new Date()).format("LTS")}
                    </span>
                    <p class="p-2 bg-secondary border border-dark rounded">
                      ${msgTag.val()}
                    </p>
                </div>`;
      messageBoxTag.append(child);
    }

    socket.emit("sendMsg", {
      sender: username,
      receiver: receiver,
      msg: msgTag.val()
    });
    msgTag.val("");
  }

  $(`#sendMessage`).mousedown(event => {
    if (event.which == 1) {
      sendMessage();
    }
  });

  $(`.input-group`).keypress(event => {
    if (event.which == 13) {
      sendMessage();
    }
  });

  $(`#tab a`).mousedown(event => {
    if (event.which == 1) {
      $(event.target).removeClass("animated bounce infinite");
    }
  });

  $("#createRoom").hide();
  $(".search-box").hide();

  socket.emit("joinRoom", { idRoom: idRoom, username: username });

  socket.on("initRoom", room => {
    console.log(room);
    let receiverTag = $(`#receiverSelect`);
    let isHost = username == room.host ? true : false;
    let playerChild = ``;
    let playerList = $(`#playerList`);
    let optionChild = `<option value="all">All</option>`;
    playerList.empty();
    receiverTag.empty();
    for (let i = 0; i < room.amount; i++) {
      if (room.player[i] != undefined) {
        playerChild += `<div class="player d-flex flex-column mr-5 align-items-center mb-5">
                          <img class="m-2" src="/avatar/${
                            room.player[i].username
                          }" onerror="javascript:this.src='http://placehold.it/150'" width="150px" height="150px">
                            <button class="btn btn-light font-weight-bold">${
                              room.player[i].username
                            }
                              <span class="badge badge-danger float-right ml-4 d-none"> 0
                              </span>
                            </button>
                        </div>`;
        if (room.player[i].username != username)
          optionChild += `<option value="${room.player[i].idSocket}">${
            room.player[i].username
          }</option>`;
      } else {
        playerChild += `<div class="player d-flex flex-column mr-5 align-items-center mb-5">
                          <img class="m-2" src="http://placehold.it/150" onerror="javascript:this.src='http://placehold.it/150'" width="150px" height="150px">
                            <button class="btn btn-light font-weight-bold">Waiting...
                              <span class="badge badge-danger float-right ml-4 d-none"> 0
                              </span>
                            </button>
                        </div>`;
      }
    }

    if (!isHost) $(`#startGame`).addClass("d-none");
    else $(`#startGame`).removeClass("d-none");
    playerList.append(playerChild);
    receiverTag.append(optionChild);
  });

  //disconnect event listen
  socket.on("disconnect", () => {
    alert("Disconnect with server!");
    window.location.href = `/`;
  });
});
