const $ = require("jquery");
const constInit = require("../constInit");

module.exports.countDown = (minutes, seconds) => {
  return new Promise((resolve, reject) => {
    let clock = $(`#clock .badge`);
    var loop = setInterval(() => {
      seconds--;
      clock.text(
        `${minutes < 10 ? `0${minutes}` : minutes}:${
          seconds < 10 ? `0${seconds}` : seconds
        }`
      );
      if (seconds == 0) {
        if (minutes > 0) {
          minutes--;
          seconds = 60;
        }
      }
      if (minutes == 0 && seconds == 0) {
        clearInterval(loop);
        resolve();
      }
    }, 1000);
  });
};

module.exports.setNotify = (content, style, position,autoHideDelay) => {
  $.notify(content, 
    { style: style, 
      position: position,
      autoHideDelay : autoHideDelay
     });
};




module.exports.setCharacter = userChar => {
  let characterTag = $(`#character`);
  let desTag = $(`#des`);
  let teamTag = $(`#team`);
  characterTag.text(userChar.character.name);
  desTag.text(userChar.character.des);
  teamTag.text(
    userChar.character.team == constInit.TEAM.werewolf
      ? `Team: Werewolf`
      : `Team: Villager`
  );
};

module.exports.selectPerson = (flag, username) => {
  if (flag)
    $(`#playerList .player`)
      .attr("disabled", false)
      .unbind("click")
      .click(event => {
        if (event.which == 1) {
          $(`#playerList .player`).removeClass("selectedPerson");
          if ($(event.currentTarget).hasClass("selectedPerson")) {
            $(event.currentTarget).removeClass("selectedPerson");
            return;
          }
          if ($(event.currentTarget).attr("id") != username)
            $(event.currentTarget).addClass("selectedPerson");
          else {
            this.setNotify(
              "You can't choose yourselft (except Bodyguard)!",
              "warning","top center", "5000"
            );
          }
        }
      });
  else $(`#playerList button`).attr("disabled", true);
};

module.exports.showAllie = characterList => {
  let allieList = characterList.filter(
    c => c.character.team == constInit.TEAM.werewolf
  );
  allieList.forEach(a => {
    $(`#${a.username} button`)
      .removeClass("btn-light")
      .addClass("btn-success");
  });
};

module.exports.showMyself = username => {
  $(`#${username} button`)
    .removeClass("btn-light")
    .addClass("btn-info");
};

module.exports.setPharse = (date, pharse) => {
  if (pharse == constInit.NIGHT) {
    $(`#phase .night`)
      .text(`Date: ${date} - Night`)
      .show();
    $(`#phase .day`).hide();
  } else {
    $(`#phase .day`)
      .text(`Date: ${date} - Day`)
      .show();
    $(`#phase .night`).hide();
  }
};

module.exports.witchNotify = (victim, userChar) => {

  if(userChar.character.save <= 0 && userChar.character.save <= 0){
    this.setNotify(`You can not SAVE or KILL anyone !!!`, "notify", "bottom left","20000");
    this.selectPerson(false, userChar.username);
  } 
  else{
    if (userChar.character.save > 0) {
      if (victim != undefined || victim != null) {
        $("#" + victim).notify(
          { content: "Do you want to save?" },
          {
            style: "witchSave",
            autoHide: false,
            clickToHide: false,
            elementPosition: "top center",
            autoHideDelay: "30000"
          }
        );
      }
      else {
        this.setNotify(`Tonight no one was killed by Werewolf!`, "notify", "bottom left","20000");
      }
    }
    if (userChar.character.save > 0) {
      this.setNotify(`Choose one person to kill if you want!`, "notify","bottom left","20000");
      this.selectPerson(true, userChar.username);
    }
  }

};

module.exports.selectPersonBodyguard = (username, room) => {
  $(`#playerList .player`)
    .attr("disabled", false)
    .unbind("click")
    .click(event => {
      if (event.which == 1) {
        let log = room.gameLog.log;
        let target = $(event.currentTarget).attr("id");
        let previousTarget = log.find(
          l =>
            l.day == room.gameLog.currentDay - 1 &&
            l.pharse == constInit.NIGHT &&
            l.voter == username
        );
        if (previousTarget != undefined) {
          if (previousTarget.victim == target) {
            this.setNotify(
              `You cannot protect one target for two consecutive nights!`,
              "warning","top center","5000"
            );
            return;
          }
        }
        if ($(event.currentTarget).hasClass("selectedPerson")) {
          $(event.currentTarget).removeClass("selectedPerson");
          return;
        }
        $(`#playerList .player`).removeClass("selectedPerson");
        $(event.currentTarget).addClass("selectedPerson");
      }
    });
};

module.exports.listPlayerPlaying = room => {
  let playerList = $(`#playerList`);
  let deadListTag = $(`#deadList`);
  let playerChild = ``;
  let deadListChild = ``;
  playerList.empty();
  deadListTag.empty();
  room.gameLog.characterRole.forEach(c => {
    if (c.status == constInit.ALIVE) {
      playerChild += `<div class="player d-flex flex-column mr-3 p-2 align-items-center mb-5" id="${
        c.username
      }">
                        <img class="m-1 border rounded" src="/avatar/${
                          c.username
                        }" onerror="javascript:this.src='http://placehold.it/80'" width="80px" height="80px">
                        <h5><span class="badge badge-danger d-none"> 0
                        </span></h5>
                          <button class="btn btn-sm btn-light font-weight-bold">
                          ${
                            c.username == room.host
                              ? `<i class="fas fa-1x fa-crown mr-1"/>`
                              : ``
                          }
                          ${c.username}
                          </button>
                      </div>`;
    } else {
      deadListChild += `<img class="border rounded mr-1" src="/avatar/${
        c.username
      }" onerror="javascript:this.src='http://placehold.it/30'" width="30px" height="30px" alt="${
        c.username
      }">`;
    }
  });
  deadListTag.append(deadListChild);
  playerList.append(playerChild);
};

module.exports.votePerson = (room, socket, userChar) => {
  let voteNumber = $(`#playerList .player h5 span`);
  voteNumber.removeClass("d-none");
  $(`#playerList .player`)
    .attr("disabled", false)
    .unbind("click")
    .click(event => {
      if (event.which == 1) {
        let target = $(event.currentTarget).attr("id");
        if (target != userChar.username) {
          socket.emit("votePerson", {
            voter: userChar.username,
            target: target,
            idRoom: room.id
          });
          $(`#playerList .player`).removeClass("selectedPerson");
          $(event.currentTarget).addClass("selectedPerson");
        }
      }
    });
};

module.exports.showVoteResult = room => {
  let voteList = room.gameLog.voteList;
  $(`#playerList .player h5 span`).text("0");
  voteList.forEach(v => {
    let spanTag = $(`#playerList #${v.target} span`);
    let voteNumber = parseInt(spanTag.text());
    voteNumber++;
    spanTag.text(voteNumber);
  });
};

module.exports.deadStatus = () => {
  $(`#controller .deadStatus`).remove();
  $(`#controller`).append(`<h1 class="deadStatus">You are Killed</h1>`);
};

module.exports.endGame = (room, team) => {
  let teamConvert = team == constInit.TEAM.werewolf ? `WEREWOLF` : `VILLAGER`;
  let tableBody = ``;

  room.gameLog.characterRole.forEach((c, index) => {
    tableBody += `<tr>
    <th scope="row">${index + 1}</th>
    <td>${c.username}</td>
    <td>${c.character.name}</td>
    <td>${
      c.character.team == constInit.TEAM.werewolf ? `Werewolf` : `Villager`
    }</td>
  </tr>`;
  });
  let modal = `<div class="modal fade" id="winModal" tabindex="-1" role="dialog" aria-labelledby="winModal" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
        <div class="display-4 text-center font-weight-bold text-dark">${teamConvert} TEAM WIN!</div>
		<div class="modal-body">
		<table class="table table-striped">
		  <thead>
			<tr>
			  <th scope="col">#</th>
			  <th scope="col">Username</th>
			  <th scope="col">Character</th>
			  <th scope="col">Team</th>
			</tr>
		  </thead>
		  <tbody>
			${tableBody}
		  </tbody>
		</table>
		</div>
		<div class="modal-footer">
         <button type="button" class="btn btn-dark" data-dismiss="modal">Close</button>
		</div>
    </div>
  </div>
</div>`;
  $(`body #winModal`).remove();
  $(`body`).append(modal);
  $(`#winModal`).modal("show");
  this.switchLayoutRoom(constInit.WAITING);
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

module.exports.removeEventListen = socket => {
  socket.off("nightPharseFinish");
  socket.off("voteResult");
  socket.off("werewolfWin");
  socket.off("villagerWin");
  socket.off("dayPharseFinish");
  socket.off("werewolfVote");
  socket.off("playerDisconect");
};

module.exports.switchLayoutRoom = switchLayoutRoom = flag => {
  let infoTag = $(`#info`);
  let controllerTag = $(`#controller`);
  let controllerToggleBtn = $(`#controllerToggle`);

  if (flag == constInit.PLAYING) {
    infoTag.removeClass("d-none");
    controllerTag.removeClass("d-none");
    controllerToggleBtn.removeClass("d-none");
  } else {
    infoTag.addClass("d-none");
    controllerTag.addClass("d-none");
    controllerToggleBtn.addClass("d-none");
  }
};
