import "../layout";
import "./animate.css";
import "../notify";
import "../styleNotify";

const sanitizeHtml = require("sanitize-html");
const $ = require("jquery");
const moment = require("moment");
const game = require("../game-client/game");
const helper = require("../game-client/helper");

window.onbeforeunload = function() {
  return "Leave?";
};

$(document).ready(() => {
  const option = {
    reconnection: false,
    transports: ["websocket"],
    upgrade: false,
    query: {
      // token: $(`meta[name=socketAuthToken]`).data("content")
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
  });

  function sendMessage() {
    let msgTag = $(`#messageText`);
    let msg = msgTag.val();
    msg = msg.trim();
    if (sanitizeHtml(msg).length == 0 || sanitizeHtml(msg).length > 255) {
      alert("Message length must be 1-255 characters!");
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
                      ${sanitizeHtml(msg)}
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
    helper.initWaitingRoom(room, socket);
  });

  $(`#roomTab`).click(event => {
    if (event.which == 1) {
      $(`#receiverSelect option`).removeAttr("selected");
      $(`#receiverSelect option[value=all]`).prop("selected", true);
    }
  });

  $("#playerAvatar").click(event => {
    if (event.which == 1) {
      alert("clicked");
    }
  });

  socket.on("startGame", room => {
    game.init(room, socket);
  });

  $(`#controllerToggle`).click(function(event) {
    if (event.which == 1) {
      let arrow = $(this).text();
      if (arrow == "<") {
        helper.handleAddAnimation("#controller", "slideOutLeft faster", () => {
          $("#controller").addClass("d-none");
        });
        $(this).text(">");
      } else {
        $("#controller").removeClass("d-none");
        helper.handleAddAnimation("#controller", "slideInLeft faster");
        $(this).text("<");
      }
    }
  });
});
