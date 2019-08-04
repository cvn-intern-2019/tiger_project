const $ = require("jquery");
const werewolf = require("./werewolf");
const auraseer = require("./auraseer");
const bodyguard = require("./bodyguard");
const hunter = require("./hunter");
const witch = require("./witch");
const helper = require("./helper");
var userChar = null;
const STATUS = {
  alive: 1,
  dead: 0
};

const ID_CHARACTER = {
  alphaWerewof: 0,
  werewolf: 1,
  auraSeer: 2,
  witch: 3,
  bodyguard: 4,
  hunter: 5,
  villager: 6
};

module.exports.init = (room, socket) => {
  let infoTag = $(`#info`);
  let controllerTag = $(`#controller`);
  var username = $(`#username`).text();
  userChar = room.gameLog.characterRole.find(c => c.username == username);
  socket.on("nightPharseFinish", room => {
    username = $(`#username`).text();
    userChar = room.gameLog.characterRole.find(c => c.username == username);
    pharseDay(room, socket);
  });

  socket.on("voteResult", room => {
    helper.showVoteResult(room);
  });

  socket.on("werewolfWin", room => {
    console.log("endgame");
  });
  socket.on("villagerWin", room => {
    console.log("endgame");
  });
  socket.on("dayPharseFinish", room => {
    console.log(room);
    pharseNight(room, socket);
  });

  helper.setCharacter(userChar);
  infoTag.removeClass("d-none");
  controllerTag.removeClass("d-none");

  pharseNight(room, socket);
};

function pharseNight(room, socket) {
  helper.listPlayerPlaying(room);
  helper.showMyself(userChar.username);
  helper.setPharse(room.gameLog.currentPharse);
  helper.selectPerson(false, userChar.username);

  werewolfTurn(room, socket);
  if (
    userChar.character.id == ID_CHARACTER.werewolf ||
    userChar.character.id == ID_CHARACTER.alphaWerewof
  ) {
    helper.showAllie(room.gameLog.characterRole);
  }

  socket.on("werewolfVote", room => {
    let MINUTES = 0;
    let SECONDS = 20;
    let countdown = helper.countDown(MINUTES, SECONDS);

    countdown.then(() => {
      if (userChar.character.id == ID_CHARACTER.auraSeer)
        auraseer(socket, userChar, room);
      if (userChar.character.id == ID_CHARACTER.witch)
        witch(socket, userChar, room);
      if (userChar.character.id == ID_CHARACTER.bodyguard)
        bodyguard(socket, userChar, room);
      if (userChar.character.id == ID_CHARACTER.hunter)
        hunter(socket, userChar, room);
    });
    if (userChar.status == STATUS.alive) {
      if (userChar.character.id == ID_CHARACTER.auraSeer) auraseerTurn();
      if (userChar.character.id == ID_CHARACTER.witch) witchTurn(room);
      if (userChar.character.id == ID_CHARACTER.bodyguard) bodyguardTurn(room);
      if (userChar.character.id == ID_CHARACTER.hunter) hunterTurn();
      if (
        userChar.character.id == ID_CHARACTER.villager ||
        userChar.character.id == ID_CHARACTER.werewolf ||
        userChar.character.id == ID_CHARACTER.alphaWerewof
      ) {
        helper.setNotify("Villager team is active!!!", "warning");
        helper.selectPerson(false, userChar.username);
      }
    } else {
      helper.deadStatus();
      helper.selectPerson(false, userChar.username);
    }
  });
}

function werewolfTurn(room, socket) {
  let MINUTES = 0;
  let SECONDS = 20;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    werewolf(socket, userChar, room.id);
  });

  if (userChar.status == STATUS.alive) {
    if (userChar.character.id == ID_CHARACTER.alphaWerewof) {
      helper.setNotify("Choose one person who you want to kill!", "notify");
      helper.selectPerson(true, userChar.username);
    } else if (userChar.character.id == ID_CHARACTER.werewolf)
      helper.setNotify(
        "Let discuss with Alpha Werewolf to choose target!",
        "notify"
      );
    else {
      helper.setNotify("Werewolf is active!!!", "warning");
    }
  } else {
    helper.setNotify("Werewolf is active!!!", "warning");
    helper.selectPerson(false, userChar.username);
  }
}

var auraseerTurn = () => {
  helper.selectPerson(true, userChar.username);
  helper.setNotify("Choose one person who you want to know!", "notify");
};

var witchTurn = room => {
  helper.selectPerson(true, userChar.username);
  let victim = room.gameLog.deadList[0];
  helper.witchNotify(userChar.character.save, userChar.character.kill, victim);
};

var bodyguardTurn = room => {
  helper.selectPersonBodyguard(userChar.username, room);
  helper.setNotify("Choose one person who you want to protect", "notify");
};

var hunterTurn = () => {
  helper.selectPerson(true, userChar.username);
  helper.setNotify("Choose one person who you want to be your target :D");
};

function pharseDay(room, socket) {
  helper.listPlayerPlaying(room);
  helper.showMyself(userChar.username);
  helper.setPharse(room.currentPharse);
  helper.selectPerson(false, userChar.username);
  if (
    userChar.character.id == ID_CHARACTER.werewolf ||
    userChar.character.id == ID_CHARACTER.alphaWerewof
  ) {
    helper.showAllie(room.gameLog.characterRole);
  }
  let MINUTES = 0;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    socket.emit("dayPharseFinish", room.id);
  });

  if (userChar.status == STATUS.alive) {
    helper.resetChoosen();

    if (
      userChar.character.id == ID_CHARACTER.werewolf ||
      userChar.character.id == ID_CHARACTER.alphaWerewof
    )
      helper.setNotify("Let's discuss and try to hide yourself!", "notify");
    else helper.setNotify("Let's discuss and find Werewolf to kill!", "notify");
    helper.votePerson(room, socket, userChar);
  } else {
    helper.deadStatus();
  }
}
