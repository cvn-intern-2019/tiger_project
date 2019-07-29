import "./layout";
const $ = require("jquery");

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
                        <h5 class="card-header text-dark">
                          <div class="badge badge-dark">ID: ${r.id}
                          </div> ${r.name}
                          ${
                            r.status == false
                              ? `<div class="badge badge-warning float-right">Waiting</div>`
                              : `<div class="badge badge-success float-right">Playing</div>`
                          }
                        </h5>
                        <div class="card-body">
                          <h5 class="card-title text-dark">
                            <strong>Host:</strong>
                              <a href="/user/${r.host}">${r.host}</a>
                          </h5>
                          <p class="card-text text-dark">
                            <strong>Players:</strong> ${r.numPlayer}/${r.amount}
                          </p>
                          <a class="btn btn-dark ${
                            r.numPlayer == r.amount || r.status == true
                              ? "disabled"
                              : ""
                          }" href="/room/${r.id}"> Join 
                          </a>
                          <input type="hidden" value=${r.socketRoomId}/>
                        </div>
                      </div>
                    </div>`;
      roomListTag.append(cardTag);
    });
  });

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
});
