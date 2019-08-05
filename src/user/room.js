import "../layout";
import "./animate.css";

const $ = require("jquery");
const moment = require("moment");
const game = require("../game-client/game");

$(document).ready(() => {
  const option = {
    reconnection: false,
    transports: ["websocket"],
    upgrade: false,
    query: {
      token: $(`meta[name=socketAuthToken]`).data("content")
    }
  };
  var socket = io("/room", option);
  var idRoom = $(`#idRoom`).text();
  var username = $(`#username`).text();

  socket.on("recMsg", data => {
    let messageBoxTag = $(`#room`);
    let messageTab = $(`#tab #roomTab`);
    let child = `<div class="my-2">
                      <h5 ${
                        data.sender == username ? `` : `style="cursor:pointer"`
                      }>
                        <img onerror="javascript:this.src='http://placehold.it/30'"
                          src="/avatar/${data.sender}"
                          width="30px" height="30px"/>
                        ${data.receiver != idRoom ? `From: ` : ``}${data.sender}
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

    $(`.my-2 h5`).mousedown(event => {
      if (event.which == 1) {
        let target = $(event.target);
        if (target.text() != username) {
          let receiver = $(target)
            .text()
            .replace("From: ", "")
            .trim();
          $(`#receiverSelect option`).removeAttr("selected");
          $(`#receiverSelect`)
            .find(`option:contains("${receiver}")`)
            .prop("selected", true);
        }
      }
    });

    $(`#room, #private`).scrollTop($($(messageBoxTag).children()[0]).height());

    if (!$(messageBoxTag).hasClass("active"))
      messageTab.addClass("animated bounce infinite");
  });

  function sendMessage() {
    let msgTag = $(`#messageText`);
    let msg = msgTag.val();
    msg = msg.trim();
    if (msg.length == 0 || msg.length > 255) {
      alert("Message length must be 1-255 characters!");
      return;
    }
    if (msg.includes(">") || msg.includes("<")) {
      alert("The message contains invalid characters!");
      return;
    }
    let receiver = idRoom;

    if ($(`#receiverSelect`).val() != "all") {
      receiver = $(`#receiverSelect`).val();
      $(`#privateTab`).trigger("click");
      let messageBoxTag = $(`#messageBoxPrivate`);
      let child = `<div class="my-2">
                    <h5>
                      <img onerror="javascript:this.src='http://placehold.it/30'"
                      src="/avatar/${username}"
                      width="30px" height="30px"/>
                      To: ${$(`#receiverSelect option:selected`).text()}
                    </h5>
                    <span class="badge badge-light float-right">
                      ${moment(new Date()).format("LTS")}
                    </span>
                    <p class="p-2 bg-secondary border border-dark rounded">
                      ${msg}
                    </p>
                </div>`;
      messageBoxTag.append(child);
    } else {
      $(`#roomTab`).trigger("click");
    }

    socket.emit("sendMsg", {
      sender: username,
      receiver: receiver,
      msg: msg
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
    let receiverTag = $(`#receiverSelect`);
    let isHost = username == room.host ? true : false;
    let playerChild = ``;
    let playerList = $(`#playerList`);
    let optionChild = `<option value="all">All</option>`;
    let startGameButton = $(`#startGame`);
    let currentReceiver = receiverTag.val();
    playerList.empty();
    receiverTag.empty();

    for (let i = 0; i < room.amount; i++) {
      if (room.player[i] != undefined) {
        playerChild += `<div class="player d-flex flex-column mr-5 align-items-center mb-5">
                          <img class="m-1 border rounded" src="/avatar/${
                            room.player[i].username
                          }" onerror="javascript:this.src='http://placehold.it/150'" width="150px" height="150px">
                            <h5><span class="badge badge-danger d-none"> 0
                            </span></h5>
                            ${
                              room.player[i].username == room.host
                                ? `<i class="fas fa-1x fa-crown"/>`
                                : ``
                            }
                            <button class="btn btn-light font-weight-bold">
                              ${room.player[i].username}
                            </button>
                        </div>`;
        if (room.player[i].username != username)
          optionChild += `<option value="${room.player[i].idSocket}">${
            room.player[i].username
          }</option>`;
      } else {
        playerChild += `<div class="player d-flex flex-column mr-5 align-items-center mb-5">
                          <img class="m-1" src="http://placehold.it/150" onerror="javascript:this.src='http://placehold.it/150'" width="150px" height="150px">
                          <h5><span class="badge badge-danger d-none"> 0
                            </span></h5>
                            <button class="btn btn-light font-weight-bold">Waiting...
                            </button>
                        </div>`;
      }
    }

    if (!isHost) startGameButton.addClass("d-none");
    else {
      startGameButton.unbind("click");
      startGameButton.click(event => {
        if (event.which == 1) {
          startGameButton.unbind("click").attr("disabled", true);
          socket.emit("startGame", idRoom);
        }
      });

      startGameButton.removeClass("d-none");
    }

    // if (room.player.length == room.amount)
    //   $(`#startGame`).attr("disabled", false);
    // else $(`#startGame`).attr("disabled", true);

    playerList.append(playerChild);
    receiverTag.append(optionChild);

    $(`#receiverSelect option`).removeAttr("selected");
    $(`#receiverSelect option[value="${currentReceiver}"]`).prop(
      "selected",
      true
    );
  });

  $(`#roomTab`).click(event => {
    if (event.which == 1) {
      $(`#receiverSelect option`).removeAttr("selected");
      $(`#receiverSelect option[value=all]`).prop("selected", true);
    }
  });

  socket.on("startGame", room => {
    game.init(room, socket);
  });
});
