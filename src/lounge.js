import "./layout";

import { restProperty } from "babel-types";

const $ = require("jquery");

let searchRoomEvent = function() {
  let keyword = $("#search_input")
    .val()
    .toLowerCase();

  $("#roomList>div")
    .hide()
    .each(function(index, element) {
      let roomName = $(element)
        .find(".room_name")
        .text()
        .toLowerCase();

      let roomAuthor = $(element)
        .find(".room_author")
        .text()
        .toLowerCase();

      if (roomName.search(keyword) != -1 || roomAuthor.search(keyword) != -1) {
        $(element).fadeIn(200);
      }
    });
};

$(document).ready(() => {
  const option = {
    // reconnection: false
  };
  var socket = io("/lounge", option);

  //list room event listen
  socket.on("listRoom", listRoom => {
    let roomListTag = $(`#roomList`);
    roomListTag.empty();

    listRoom.sort((a, b) => {
      return a.status > b.status;
    });

    listRoom.forEach(r => {
      let cardTag = `<div class="col-sm-3 mt-3">
                      <div class="card">
                        <h5 class="card-header text-dark room_name">
                          <div class="badge badge-dark">ID: ${r.id}
                          </div> ${r.name}
                          ${
                            r.status == false
                              ? `<div class="badge badge-warning float-right">Waiting</div>`
                              : `<div class="badge badge-success float-right">Playing</div>`
                          }
                        </h5>
                        <div class="card-body">
                          <h5 class="card-title text-dark room_author">
                            <strong>Host:</strong>
                              <a href="/user/${r.host}" >${r.host}</a>
                          </h5>
                          <p class="card-text text-dark">
                            <strong>Players:</strong> 
                            ${r.player.length}/${r.amount}
                          </p>
                          <a class="btn btn-dark ${
                            r.player.length == r.amount || r.status == true
                              ? "disabled"
                              : ""
                          }" href="/room/${r.id}"> Join 
                          </a>
                        </div>
                      </div>
                    </div>`;
      roomListTag.append(cardTag);
    });
  });

<<<<<<< HEAD
  //create room event listen
  socket.on("createRoom", room => {
    if (room) window.location.href = `/room/${room.id}`;
    else alert("Something wrong!");
  });

  $(`#createRoom`).mousedown(event => {
    if (event.which == 1) {
      let username = $(`#navbarDropdown #username`).text();
      socket.emit("createRoom", username);
    }
  });

  //disconnect event listen
  // socket.on("disconnect", () => {
  //   alert("Disconnect with server!");
  //   window.location.href = `/`;
  // });
=======
  $("#search_input").keyup(searchRoomEvent);
>>>>>>> dev
});
