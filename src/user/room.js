import "../layout";
import "./animate.css";

const $ = require("jquery");
const moment = require("moment");

$(document).ready(() => {
  const option = {
    // reconnection: false
  };
  var socket = io("/room", option);
  var idRoom = $(`#idRoom`).text();
  var username = $(`#username`).text();

  function checkImage(src, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = src;
  }

  socket.on("recMsg", data => {
    let messageBoxTag = $(`#room`);
    let messageTab = $(`#tab #roomTab`);

    checkImage(
      `/avatar/${data.sender}`,
      () => {
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

        $(`#room, #private`).scrollTop(
          $($(messageBoxTag).children()[0]).height()
        );

        if (!$(messageBoxTag).hasClass("active"))
          messageTab.addClass("animated bounce infinite");
      },
      () => {
        let child = `<div class="my-2">
                      <h5>
                        <img src="http://placehold.it/30" 
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

        $(`#room, #private`).scrollTop(
          $($(messageBoxTag).children()[0]).height()
        );

        if (!$(messageBoxTag).hasClass("active"))
          messageTab.addClass("animated bounce infinite");
      }
    );
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
                      ${msg}
                    </p>
                </div>`;
      messageBoxTag.append(child);
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
    let listPlayerTag = $(`#listPlayers`);
    let receiverTag = $(`#receiverSelect`);
    let isHost = null;
    let playerChild = ``;
    let optionChild = `<option value="all">All</option>`;
    listPlayerTag.empty();
    receiverTag.empty();
    room.player.forEach(p => {
      if (p.username == username) {
        isHost = p.isHost ? true : false;
      }
      //   playerChild += `<h5 class="list-group-item list-group-item-action">
      //                 <img src="/avatar/${p.username}"
      //                   alt=""
      //                   width="30px" height="30px"/>
      //                 ${p.username}
      //                 ${p.isHost ? `<i class="float-right fas fa-crown"/>` : ""}
      //                 </a>`;
      if (p.username != username)
        optionChild += `<option value="${p.idSocket}">${p.username}</option>`;
    });
    if (!isHost) $(`#startGame`).addClass("d-none");
    else $(`#startGame`).removeClass("d-none");
    // listPlayerTag.append(playerChild);
    receiverTag.append(optionChild);
  });
});
