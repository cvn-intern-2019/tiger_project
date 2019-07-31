import "../layout";
import "./animate.css";

const $ = require("jquery");
const moment = require("moment");

$(document).ready(() => {
  const option = {
    reconnection: false,
    transports: ["websocket"],
    upgrade: false
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
    console.log(room);
    let listPlayerTag = $(`#listPlayers`);
    let receiverTag = $(`#receiverSelect`);
    let isHost = null;
    let playerChild = ``;
    let optionChild = `<option value="all">All</option>`;
    let currentReceiver = receiverTag.val();
    let startGameButton = $(`#startGame`);

    listPlayerTag.empty();
    receiverTag.empty();

    room.player.forEach(p => {
      if (p.username == username) {
        isHost = p.isHost ? true : false;
      }
      if (p.username != username)
        optionChild += `<option value="${p.idSocket}">${p.username}</option>`;
    });

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
    console.log(room);
  });
});
