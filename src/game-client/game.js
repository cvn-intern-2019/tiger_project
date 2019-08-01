const $ = require("jquery");
const werewolf = require("./werewolf");
const auraseer = require("./auraseer");
const PHARSE = {
  night: 0,
  day: 1
};
const TEAM = {
  werewolf: 0,
  villager: 1
};

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
var username = null;
var userChar = null;

function setPharse(pharse) {
  let pharseNotify = $(`#phase .badge`);
  pharseNotify.text(pharse == PHARSE.night ? "Night" : "Day");
}

function setNotify(content) {
  let notifyTag = $(`#notify`);
  notifyTag.text(content);
}

function setCharacter() {
  let characterTag = $(`#character`);
  let desTag = $(`#des`);
  characterTag.text(userChar.character.name);
  desTag.text(userChar.character.des);
}

function selectPerson() {
  $(`#playerList button`)
    .attr("disabled", false)
    .unbind("click")
    .click(event => {
      if (event.which == 1) {
        let choosenPerson = $(event.target)
          .text()
          .trim();
        if (choosenPerson != username) $(`#choosenPerson`).text(choosenPerson);
      }
    });
}

function showAllie(allie) {
  let temp = $(`#playerList .player`)
    .find(`button:contains("${allie}")`)
    .removeClass("btn-light")
    .addClass("btn-success");
  console.log(temp);
}

module.exports.init = (room, socket) => {
  let infoTag = $(`#info`);
  let controllerTag = $(`#controller`);
  username = $(`#username`).text();
  userChar = room.gameLog.characterRole.find(c => c.username == username);
  setPharse(room.gameLog.currentPharse);
  setCharacter();
  infoTag.removeClass("d-none");
  controllerTag.removeClass("d-none");
  if (
    userChar.character.id == ID_CHARACTER.werewolf ||
    userChar.character.id == ID_CHARACTER.alphaWerewof
  ) {
    let allie = room.gameLog.characterRole.find(
      c => c.username != username && c.character.team == TEAM.werewolf
    );
    showAllie(allie.username);
    console.log(allie.username);
  }
  werewolfTurn(room, socket);
};

function werewolfTurn(room, socket) {
  setNotify("Werewolf is active >.<");

  if (userChar.status == STATUS.alive) {
    $(`#playerList button`).attr("disabled", true);
    if (userChar.character.id == ID_CHARACTER.alphaWerewof) {
      selectPerson();
      werewolf(socket, userChar, room.id);
    }
    if (userChar.character.id == ID_CHARACTER.werewolf)
      werewolf(socket, userChar, room.id);
  } else {
    $(`#playerList button`).attr("disabled", true);
  }
}

module.exports.auraseerTurn = (room, socket) => {
  setNotify("Aura Seer is active >.<");

  if (userChar.status == STATUS.alive) {
    $(`#playerList button`).attr("disabled", true);
    if (userChar.character.id == ID_CHARACTER.auraSeer) {
      selectPerson();
      auraseer(socket, userChar, room);
    }
  } else {
    $(`#playerList button`).attr("disabled", true);
  }
};
