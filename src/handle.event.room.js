const $ = require("jquery");
const sanitizeHtml = require("sanitize-html");
const moment = require("moment");
const helper = require("./game-client/helper");

module.exports.recMsg = data => {
  let idRoom = $(`#idRoom`).text();
  let messageBoxTag = $(`#room`);
  let messageTab = $(`#tab #roomTab`);
  let child = `<div class="my-2">
        <h5 ${data.sender == username ? `` : `style="cursor:pointer"`}>
          <img onerror="javascript:this.src='http://placehold.it/30'"
            src="/avatar/${data.sender}"
            width="30px" height="30px"/>
          ${data.receiver != idRoom ? `From: ` : ``}${data.sender}
        </h5>
        <span class="badge badge-light float-right">
          ${moment(new Date()).format("LTS")}</span>
        <p class="p-2 bg-secondary border border-dark rounded">
          ${sanitizeHtml(data.msg)}
        </p>
      </div>`;

  if (data.receiver != idRoom) {
    messageBoxTag = $(`#private`);
    messageTab = $(`#privateTab`);
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
    $(messageTab)
      .removeClass("animated bounce infinite")
      .addClass("animated bounce infinite");
};

module.exports.sendMsg = socket => {
  let username = $(`#username`).text();
  let idRoom = $(`#idRoom`).text();
  let msgTag = $(`#messageText`);
  let msg = msgTag.val();
  msg = sanitizeHtml(msg.trim());

  if (msg.length == 0 || msg.length > 255) {
    alert(
      "Message length must be 1-255 characters\nMake sure input don't have any special word."
    );
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
};

module.exports.toggleController = function(target) {
  let arrow = $(target).text();
  if (arrow == "<") {
    helper.handleAddAnimation("#controller", "slideOutLeft faster", () => {
      $("#controller").addClass("d-none");
    });
    $(target).text(">");
  } else {
    $("#controller").removeClass("d-none");
    helper.handleAddAnimation("#controller", "slideInLeft faster");
    $(target).text("<");
  }
};

module.exports.initWaitingRoom = (room, socket) => {
  let username = $(`#username`).text();
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
      playerChild += `<div class="player d-flex flex-column mr-3 p-2 align-items-center mb-5" id="${
        room.player[i].username
      }">
                        <img class="m-1 border rounded" src="/avatar/${
                          room.player[i].username
                        }" onerror="javascript:this.src='http://placehold.it/80'" width="80px" height="80px">
                          <h5>
                            <span class="badge badge-danger d-none">0</span>
                          </h5>          
                          <button class="btn btn-sm btn-light font-weight-bold">
                          ${
                            room.player[i].username == room.host
                              ? `<i class="fas fa-1x fa-crown mr-1"/>`
                              : ``
                          }
                            ${room.player[i].username}
                          </button>
                      </div>`;

      if (room.player[i].username != username)
        optionChild += `<option value="${room.player[i].idSocket}">${
          room.player[i].username
        }</option>`;
    } else {
      playerChild += `<div class="player d-flex flex-column mr-3 align-items-center mb-5">
                        <img class="m-1" src="http://placehold.it/80" onerror="javascript:this.src='http://placehold.it/80'" width="80px" height="80px">
                        <h5>
                          <span class="badge badge-danger d-none">0</span>
                        </h5>
                          <button class="btn btn-sm btn-light font-weight-bold">Waiting...
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
        socket.emit("startGame", room.id);
      }
    });

    startGameButton.removeClass("d-none");
  }

  if (room.player.length == room.amount)
    $(`#startGame`).attr("disabled", false);
  else $(`#startGame`).attr("disabled", true);

  playerList.append(playerChild);
  receiverTag.append(optionChild);

  $(`#receiverSelect option`).removeAttr("selected");
  $(`#receiverSelect option[value="${currentReceiver}"]`).prop(
    "selected",
    true
  );
};
