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
    console.log(room);
  });

  // socket.on("witchTurn", room => {
  //   witchTurn(room, socket);
  // });

  helper.setCharacter(userChar);
  infoTag.removeClass("d-none");
  controllerTag.removeClass("d-none");

  if (
    userChar.character.id == ID_CHARACTER.werewolf ||
    userChar.character.id == ID_CHARACTER.alphaWerewof
  ) {
    helper.showAllie(room.gameLog.characterRole, username);
  }
  pharseNight(room, socket);
};

function pharseNight(room, socket) {
  helper.setPharse(room.gameLog.currentPharse);
  helper.selectPerson(false, userChar.username);
  werewolfTurn(room, socket);
  socket.on("werewolfVote", room => {
    let MINUTES = 0;
    let SECONDS = 20;
    let countdown = helper.countDown(MINUTES, SECONDS);

    helper.setNotify("Your turn");
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

    if (userChar.character.id == ID_CHARACTER.auraSeer) auraseerTurn();
    if (userChar.character.id == ID_CHARACTER.witch) witchTurn(room);
    if (userChar.character.id == ID_CHARACTER.bodyguard) bodyguardTurn(room);
    if (userChar.character.id == ID_CHARACTER.hunter) hunterTurn();
    if (
      userChar.character.id == ID_CHARACTER.villager ||
      userChar.character.id == ID_CHARACTER.werewolf ||
      userChar.character.id == ID_CHARACTER.alphaWerewof
    )
      helper.selectPerson(false, userChar.username);
  });
}

function werewolfTurn(room, socket) {
  helper.setNotify("Werewolf is active >.<");
  let MINUTES = 0;
  let SECONDS = 20;
  let countdown = helper.countDown(MINUTES, SECONDS);
  countdown.then(() => {
    werewolf(socket, userChar, room.id);
  });

  if (userChar.status == STATUS.alive) {
    if (userChar.character.id == ID_CHARACTER.alphaWerewof) {
      helper.selectPerson(true, userChar.username);
    }
  } else {
    helper.selectPerson(false, userChar.username);
  }
}

var auraseerTurn = () => {
  if (userChar.status == STATUS.alive) {
    helper.selectPerson(true, userChar.username);
    helper.setNotify("Choose one person who you want :D");
  } else {
    helper.selectPerson(false, userChar.username);
  }
};

var witchTurn = room => {
  if (userChar.status == STATUS.alive) {
    helper.selectPerson(true, userChar.username);
    let victim = room.gameLog.deadList[0];
    helper.witchNotify(
      userChar.character.save,
      userChar.character.kill,
      victim
    );
  } else {
    helper.selectPerson(false, userChar.username);
  }
};

var bodyguardTurn = room => {
  if (userChar.status == STATUS.alive) {
    helper.selectPersonBodyguard(userChar.username, room);
    helper.setNotify("Choose one person who you want to protect :D");
  } else {
    helper.selectPerson(false, userChar.username);
  }
};

var hunterTurn = () => {
  if (userChar.status == STATUS.alive) {
    helper.selectPerson(true, userChar.username);
    helper.setNotify("Choose one person who you want to be your target :D");
  } else {
    helper.selectPerson(false, userChar.username);
  }
};
