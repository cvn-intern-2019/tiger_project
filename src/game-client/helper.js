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

module.exports.setNotify = (content, style) => {
  $.notify(content, { style: style, position: "top center" });
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
          if ($(event.currentTarget).attr("id") != username)
            $(event.currentTarget).addClass("selectedPerson");
          else {
            this.setNotify(
              "You can't choose yourselft (except Bodyguard)!",
              "warning"
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

module.exports.setPharse = pharse => {
  let pharseNotify = $(`#phase .badge`);
  pharseNotify.text(pharse == constInit.NIGHT ? "Night" : "Day");
  pharseNotify.remove("flip").addClass("animated flip faster");
};

module.exports.witchNotify = (save, kill, victim) => {
  if (save > 0) {
    if (victim != undefined || victim != null) {
      $("#" + victim).notify(
        { content: "Do you want to save?", button: "Save" },
        {
          style: "witchSave",
          autoHide: false,
          clickToHide: false,
          elementPosition: "top center"
        }
      );
    } else {
      this.setNotify(`No one was killed by Werewolf!`, "notify");
    }
  } else {
    this.setNotify(`You can't save anyone more!`, "notify");
  }

  if (kill > 0) {
    this.setNotify(`Choose one person to kill if you want!`, "notify");
    this.selectPerson(true);
  } else {
    this.setNotify(`You can't kill anyone more!`, "notify");
    this.selectPerson(false);
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
              "notify"
            );
            return;
          }
        } else {
          $(`#playerList .player`).removeClass("selectedPerson");
          $(event.currentTarget).addClass("selectedPerson");
        }
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

module.exports.resetChoosen = () => {
  $(`#choosenPerson`).text("");
};

module.exports.deadStatus = () => {
  $(`#controller .deadStatus`).remove();
  $(`#controller`).append(`<h1 class="deadStatus">You are Killed</h1>`);
};
