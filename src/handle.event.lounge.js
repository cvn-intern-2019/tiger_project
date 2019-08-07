const $ = require("jquery");
const sanitizeHtml = require("sanitize-html");
const constInit = require("./constInit");

module.exports.searchRoomEvent = function() {
  let keyword = sanitizeHtml(
    $("#search_input")
      .val()
      .toLowerCase()
  );

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

module.exports.listenCreateRoom = room => {
  if (room) window.location.href = `/room/${room.id}`;
  else alert("Something wrong!");
};

module.exports.emitCreateRoom = socket => {
  let username = $(`#username`).text();
  socket.emit("createRoom", username);
};

module.exports.listRoom = listRoom => {
  let roomListTag = $(`#roomList`);
  let cardTag = ``;
  roomListTag.empty();

  listRoom.sort((a, b) => {
    return a.status > b.status;
  });

  listRoom.forEach(r => {
    cardTag += `<div class="col-sm-3 mt-3">
                      <div class="card">
                        <h5 class="card-header text-dark room_name">
                          <div class="badge badge-dark">ID: ${r.id}
                          </div> ${r.name}
                          ${
                            r.status == constInit.WAITING
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
                            r.player.length == r.amount ||
                            r.status == constInit.PLAYING
                              ? "disabled"
                              : ""
                          }" href="/room/${r.id}"> Join 
                          </a>
                        </div>
                      </div>
                    </div>`;
  });
  roomListTag.append(cardTag);
};
