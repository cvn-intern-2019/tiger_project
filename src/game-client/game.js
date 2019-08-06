const $ = require("jquery");
const werewolf = require("./werewolf");
const auraseer = require("./auraseer");
const bodyguard = require("./bodyguard");
const hunter = require("./hunter");
const witch = require("./witch");
const helper = require("./helper");
const constInit = require("../constInit");
var userChar = null;

module.exports.init = (room, socket) => {
  helper.removeEventListen(socket);

  var username = $(`#username`).text();
  userChar = room.gameLog.characterRole.find(c => c.username == username);

  socket.on("nightPharseFinish", room => {
    pharseDay(room, socket);
  });

  socket.on("voteResult", room => {
    helper.showVoteResult(room);
  });

  socket.on("werewolfWin", room => {
    helper.endGame(room, constInit.TEAM.werewolf);
    helper.initWaitingRoom(room, socket);
  });
  socket.on("villagerWin", room => {
    helper.endGame(room, constInit.TEAM.villager);
    helper.initWaitingRoom(room, socket);
  });
  socket.on("dayPharseFinish", room => {
    pharseNight(room, socket);
  });

  socket.on("werewolfVote", room => {
    villagerTurn(room, socket);
  });

  socket.on("playerDisconect", data => {
    helper.setNotify(`${data.character} disconnect!`, "warning" ,"top center","5000");
    userChar = data.room.gameLog.characterRole.find(
      c => c.username == username
    );
    helper.listPlayerPlaying(data.room);
  });

  helper.setCharacter(userChar);
  helper.switchLayoutRoom(constInit.PLAYING);
  pharseNight(room, socket);
};

function pharseNight(room, socket) {
  username = $(`#username`).text();
  userChar = room.gameLog.characterRole.find(c => c.username == username);
  helper.listPlayerPlaying(room);
  helper.showMyself(userChar.username);
  helper.setPharse(room.gameLog.currentDay, room.gameLog.currentPharse);
  helper.selectPerson(false, userChar.username);
  
  werewolfTurn(room, socket);
  if (userChar.character.team == constInit.TEAM.werewolf) {
    helper.showAllie(room.gameLog.characterRole);
  }
}

function werewolfTurn(room, socket) {
  let MINUTES = 0;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    werewolf(socket, userChar, room);
  });

  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.id == constInit.ID_CHARACTER.alphaWerewof) {
      helper.setNotify("Choose one person who you want to kill!", "notify" ,"bottom left","20000");
      helper.selectPerson(true, userChar.username);
    }

    if (userChar.character.id == constInit.ID_CHARACTER.werewolf) {
      let alphaWerewof = room.gameLog.characterRole.find(
        c =>
          c.character.id == constInit.ID_CHARACTER.alphaWerewof &&
          c.status == constInit.ALIVE
      );
      if (alphaWerewof == undefined) {
        helper.setNotify("Choose one person who you want to kill!", "notify" ,"bottom left","20000");
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
      helper.setNotify("Werewolf is active!!!", "warning", "top center","30000");
      helper.selectPerson(false, userChar.username);
    }
  } else {
    helper.selectPerson(false, userChar.username);
  }
}

var auraseerTurn = () => {
  helper.selectPerson(true, userChar.username);
  helper.setNotify("Choose one person who you want to know!", "notify" ,"bottom left","20000");
};

var witchTurn = room => {
  helper.selectPerson(true, userChar.username);
  let victim = room.gameLog.deadList[0];
  helper.witchNotify(victim, userChar);
};

var bodyguardTurn = room => {
  helper.selectPersonBodyguard(userChar.username, room);
  helper.setNotify("Choose one person who you want to protect", "notify" ,"bottom left","20000");
};

var hunterTurn = () => {
  helper.selectPerson(true, userChar.username);
  helper.setNotify(
    "Choose one person who you want to be your target!",
    "notify" ,"bottom left","20000"
  );
};

function pharseDay(room, socket) {
  username = $(`#username`).text();
  userChar = room.gameLog.characterRole.find(c => c.username == username);
  helper.setPharse(room.gameLog.currentDay, room.gameLog.currentPharse);
  helper.listPlayerPlaying(room);

  if (userChar.character.team == constInit.TEAM.werewolf) {
    helper.showAllie(room.gameLog.characterRole);
  }
  let MINUTES = 1;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    socket.emit("dayPharseFinish", room.id);
  });

  if (userChar.status == constInit.ALIVE) {
    helper.showMyself(userChar.username);
    if (userChar.character.team == constInit.TEAM.werewolf)
      helper.setNotify("Let's discuss and try to hide yourself!", "notify","top center" ,"30000");
    else helper.setNotify("Let's discuss and find Werewolf to kill!", "notify", "top center","30000");

    helper.votePerson(room, socket, userChar);
  } else {
    helper.deadStatus();
    helper.selectPerson(false, userChar.username);
  }
}

function villagerTurn(room, socket) {
  username = $(`#username`).text();
  userChar = room.gameLog.characterRole.find(c => c.username == username);
  let MINUTES = 0;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);

  countdown.then(() => {
    if (userChar.status == constInit.ALIVE) {
      if (userChar.character.id == constInit.ID_CHARACTER.auraSeer)
        auraseer(socket, userChar, room);
      if (userChar.character.id == constInit.ID_CHARACTER.witch)
        witch(socket, userChar, room);
      if (userChar.character.id == constInit.ID_CHARACTER.bodyguard)
        bodyguard(socket, userChar, room);
      if (userChar.character.id == constInit.ID_CHARACTER.hunter)
        hunter(socket, userChar, room);
    }
  });

  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.id == constInit.ID_CHARACTER.auraSeer)
      auraseerTurn();
    if (userChar.character.id == constInit.ID_CHARACTER.witch) witchTurn(room);
    if (userChar.character.id == constInit.ID_CHARACTER.bodyguard)
      bodyguardTurn(room);
    if (userChar.character.id == constInit.ID_CHARACTER.hunter) hunterTurn();
    if (
      userChar.character.id == constInit.ID_CHARACTER.villager ||
      userChar.character.id == constInit.ID_CHARACTER.werewolf ||
      userChar.character.id == constInit.ID_CHARACTER.alphaWerewof
    ) {
      helper.setNotify("Villager team is active!!!", "warning" ,"top center","30000");
      helper.selectPerson(false, userChar.username);
    }
  } else {
    helper.deadStatus();
    helper.selectPerson(false, userChar.username);
  }
}
