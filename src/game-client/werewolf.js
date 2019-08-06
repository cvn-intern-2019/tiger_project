const helper = require("./helper");
const constInit = require("../constInit");
const $ = require("jquery");

module.exports.vote = (socket, userChar, room) => {
  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.id == constInit.ID_CHARACTER.alphaWerewof) {
      let victim = $(`#playerList .selectedPerson`).attr("id") || null;
      socket.emit("werewolfVote", {
        voter: userChar.username,
        victim: victim,
        idRoom: room.id
      });
    }
    if (userChar.character.id == constInit.ID_CHARACTER.werewolf) {
      let alphaWerewof = room.gameLog.characterRole.find(
        c =>
          c.character.id == constInit.ID_CHARACTER.alphaWerewof &&
          c.status == constInit.ALIVE
      );

      if (alphaWerewof == undefined) {
        let victim = $(`#playerList .selectedPerson`).attr("id") || null;
        socket.emit("werewolfVote", {
          voter: userChar.username,
          victim: victim,
          idRoom: room.id
        });
      }
    }
  }
};

module.exports.action = (room, socket) => {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  let MINUTES = 0;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    this.vote(socket, userChar, room);
  });

  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.id == constInit.ID_CHARACTER.alphaWerewof) {
      helper.setNotify(
        "Choose one person who you want to kill!",
        "notify",
        "bottom left",
        "20000"
      );
      helper.selectPerson(true, userChar.username);
    }

    if (userChar.character.id == constInit.ID_CHARACTER.werewolf) {
      let alphaWerewof = room.gameLog.characterRole.find(
        c =>
          c.character.id == constInit.ID_CHARACTER.alphaWerewof &&
          c.status == constInit.ALIVE
      );
      if (alphaWerewof == undefined) {
        helper.setNotify(
          "Choose one person who you want to kill!",
          "notify",
          "bottom left",
          "20000"
        );
        helper.selectPerson(true, userChar.username);
      } else {
        helper.setNotify(
          "Let discuss with Alpha Werewolf to choose target!",
          "notify",
          "bottom left",
          "20000"
        );
      }
    }

    if (userChar.character.team == constInit.TEAM.villager) {
      helper.setNotify(
        "Werewolf is active!!!",
        "warning",
        "top center",
        "30000"
      );
      helper.selectPerson(false, userChar.username);
    }
  } else {
    helper.selectPerson(false, userChar.username);
    helper.deadStatus();
  }
};
