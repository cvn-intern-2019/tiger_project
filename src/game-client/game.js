const $ = require("jquery");
const werewolf = require("./werewolf");
const auraseer = require("./auraseer");
const bodyguard = require("./bodyguard");
const hunter = require("./hunter");
const witch = require("./witch");
const helper = require("./helper");
const constInit = require("../constInit");

module.exports.init = (room, socket) => {
  helper.removeEventListen(socket);

  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);

  socket.on("nightPharseFinish", room => {
    pharseDay(room, socket);
  });

  socket.on("dayPharseFinish", room => {
    pharseNight(room, socket);
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

  socket.on("werewolfVote", room => {
    villagerTurn(room, socket);
  });

  socket.on("playerDisconect", data => {
    helper.setNotify(
      `${data.character} disconnect!`,
      "warning",
      "top center",
      "5000"
    );
    helper.listPlayerPlaying(data.room);
  });

  helper.setCharacter(userChar);
  helper.switchLayoutRoom(constInit.PLAYING);
  pharseNight(room, socket);
};

function pharseNight(room, socket) {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  helper.listPlayerPlaying(room);
  helper.setPharse(room.gameLog.currentDay, room.gameLog.currentPharse);
  helper.selectPerson(false, userChar.username);

  werewolf.action(room, socket);
}

function pharseDay(room, socket) {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  helper.setPharse(room.gameLog.currentDay, room.gameLog.currentPharse);
  helper.listPlayerPlaying(room);

  let MINUTES = 0;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    socket.emit("dayPharseFinish", room.id);
  });

  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.team == constInit.TEAM.werewolf)
      helper.setNotify(
        "Let's discuss and try to hide yourself!",
        "notify",
        "top center",
        "30000"
      );
    else
      helper.setNotify(
        "Let's discuss and find Werewolf to kill!",
        "notify",
        "top center",
        "30000"
      );

    helper.votePerson(room, socket, userChar);
  } else {
    helper.deadStatus();
    helper.selectPerson(false, userChar.username);
  }
}

function villagerTurn(room, socket) {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  let MINUTES = 0;
  let SECONDS = 30;
  let countdown = helper.countDown(MINUTES, SECONDS);

  countdown.then(() => {
    if (userChar.status == constInit.ALIVE) {
      if (userChar.character.id == constInit.ID_CHARACTER.auraSeer)
        auraseer.vote(socket, userChar, room);
      if (userChar.character.id == constInit.ID_CHARACTER.witch)
        witch.vote(socket, userChar, room);
      if (userChar.character.id == constInit.ID_CHARACTER.bodyguard)
        bodyguard.vote(socket, userChar, room);
      if (userChar.character.id == constInit.ID_CHARACTER.hunter)
        hunter.vote(socket, userChar, room);
    }
  });

  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.id == constInit.ID_CHARACTER.auraSeer)
      auraseer.action();
    if (userChar.character.id == constInit.ID_CHARACTER.witch)
      witch.action(room);
    if (userChar.character.id == constInit.ID_CHARACTER.bodyguard)
      bodyguard.vote(room);
    if (userChar.character.id == constInit.ID_CHARACTER.hunter) hunter.vote();
    if (
      userChar.character.team == constInit.TEAM.werewolf ||
      userChar.character.id == constInit.ID_CHARACTER.alphaWerewof
    ) {
      helper.setNotify(
        "Villager team is active!!!",
        "warning",
        "top center",
        "30000"
      );
      helper.selectPerson(false, userChar.username);
    }
  } else {
    helper.deadStatus();
    helper.selectPerson(false, userChar.username);
  }
}
