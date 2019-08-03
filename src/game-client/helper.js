const $ = require("jquery");
const constInit = require("../constInit");
const PHARSE = {
  night: 0,
  day: 1
};
const STATUS = {
  alive: 1,
  dead: 0
};
const TEAM = {
  werewolf: 0,
  villager: 1
};

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

module.exports.setNotify = content => {
  let notifyTag = $(`#notify`);
  notifyTag.text(content);
};

module.exports.setCharacter = userChar => {
  let characterTag = $(`#character`);
  let desTag = $(`#des`);
  characterTag.text(userChar.character.name);
  desTag.text(userChar.character.des);
};

module.exports.selectPerson = (flag, username) => {
  if (flag)
    $(`#playerList button`)
      .attr("disabled", false)
      .unbind("click")
      .click(event => {
        if (event.which == 1) {
          let choosenPerson = $(event.target)
            .text()
            .trim();
          if (choosenPerson != username)
            $(`#choosenPerson`).text(choosenPerson);
        }
      });
  else $(`#playerList button`).attr("disabled", true);
};

module.exports.showAllie = characterList => {
  let allie = characterList.find(
    c => c.character.team == constInit.TEAM.werewolf
  );
  $(`#playerList .player`)
    .find(`button:contains("${allie.username}")`)
    .removeClass("btn-light")
    .addClass("btn-success");
};

module.exports.setPharse = pharse => {
  let pharseNotify = $(`#phase .badge`);
  pharseNotify.text(pharse == constInit.NIGHT ? "Night" : "Day");
};

module.exports.witchNotify = (save, kill, victim) => {
  let saveNotifyTag = $(`#saveNotify`);
  let killNotifyTag = $(`#killNotify`);
  let saveOptionTag = $(`#saveOption`);
  if (save > 0) {
    if (victim != undefined || victim != null) {
      saveNotifyTag.text(
        `${victim} was killed by Werewolf. Do you want to save?`
      );
    } else {
      saveNotifyTag.text(`No one was killed by Werewolf!`);
      saveOptionTag.addClass("d-none");
    }
  } else {
    saveNotifyTag.text(`You can't save anyone more!`);
    saveOptionTag.addClass("d-none");
  }

  if (kill > 0) {
    killNotifyTag.text(`Choose one person to kill if you want!`);
    this.selectPerson(true);
  } else {
    killNotifyTag.text(`You can't kill anyone more!`);
    this.selectPerson(false);
  }
  killNotifyTag.removeClass("d-none");
  saveNotifyTag.removeClass("d-none");
  $(`#witchFunction`).removeClass("d-none");
};

module.exports.selectPersonBodyguard = (username, room) => {
  $(`#playerList button`)
    .attr("disabled", false)
    .unbind("click")
    .click(event => {
      if (event.which == 1) {
        let log = room.gameLog.log;
        let target = $(event.target)
          .text()
          .trim();
        let previousTarget = log.find(
          l =>
            l.day == room.gameLog.currentDay - 1 &&
            l.pharse == constInit.NIGHT &&
            l.voter == username
        );
        if (previousTarget != undefined) {
          if (previousTarget.victim == target) {
            this.setNotify(
              `You cannot protect one target for two consecutive nights!`
            );
            return;
          }
        } else {
          this.setNotify(`Good choice :D`);
          $(`#choosenPerson`).text(target);
        }
      }
    });
};

// module.exports.listPlayerWating = room => {
//   let playerList = $(`#playerList`);
//   let playerChild = ``;
//   playerList.empty();
//   for (let i = 0; i < room.amount; i++) {
//     if (room.player[i] != undefined) {
//       playerChild += `<div class="player d-flex flex-column mr-5 align-items-center mb-5">
//                         <img class="m-1 border rounded" src="/avatar/${
//                           room.player[i].username
//                         }" onerror="javascript:this.src='http://placehold.it/150'" width="150px" height="150px">
//                           <h5><span class="badge badge-danger d-none"> 0
//                           </span></h5>
//                           <button class="btn btn-light font-weight-bold">
//                             ${
//                               room.player[i].username == room.host
//                                 ? `<i class="fas fa-crown mr-2"/>`
//                                 : ``
//                             }${room.player[i].username}
//                           </button>
//                       </div>`;
//     } else {
//       playerChild += `<div class="player d-flex flex-column mr-5 align-items-center mb-5">
//                         <img class="m-1" src="http://placehold.it/150" onerror="javascript:this.src='http://placehold.it/150'" width="150px" height="150px">
//                         <h5><span class="badge badge-danger d-none"> 0
//                           </span></h5>
//                           <button class="btn btn-light font-weight-bold">Waiting...
//                           </button>
//                       </div>`;
//     }
//   }

//   playerList.append(playerChild);
// };

module.exports.listPlayerPlaying = room => {
  let playerList = $(`#playerList`);
  let deadListTag = $(`#deadList`);
  let playerChild = ``;
  let deadListChild = ``;
  playerList.empty();
  deadListTag.empty();
  for (let i = 0; i < room.amount; i++) {
    if (room.player[i] != undefined) {
      let playerRole = room.gameLog.characterRole.find(
        c => c.username == room.player[i].username
      );
      if (playerRole != undefined) {
        if (playerRole.status == constInit.ALIVE) {
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
        } else {
          deadListChild += `<img class="border rounded m-2" src="/avatar/${
            room.player[i].username
          }" onerror="javascript:this.src='http://placehold.it/50'" width="50px" height="50px">`;
        }
      }
    }
  }
  deadListTag.append(deadListChild);
  playerList.append(playerChild);
};

module.exports.votePerson = (room, socket, userChar) => {
  let voteNumber = $(`#playerList .player h5 span`);
  voteNumber.removeClass("d-none");
  $(`#playerList button`)
    .attr("disabled", false)
    .unbind("click")
    .click(event => {
      if (event.which == 1) {
        let target = $(event.target)
          .text()
          .trim();
        if (target != userChar.username) {
          socket.emit("votePerson", {
            voter: userChar.username,
            target: target,
            idRoom: room.id
          });
          $(`#choosenPerson`).text(target);
        }
      }
    });
};

module.exports.showVoteResult = room => {
  let voteList = room.gameLog.voteList;
  $(`#playerList .player h5 span`).text("0");
  voteList.forEach(v => {
    let spanTag = $(`#playerList .player`)
      .find(`button:contains("${v.target}")`)
      .siblings("h5")
      .children("span");
    let voteNumber = parseInt(spanTag.text());

    voteNumber++;
    spanTag.text(voteNumber);
  });
};

module.exports.resetChoosen = () => {
  $(`#choosenPerson`).text("");
};
