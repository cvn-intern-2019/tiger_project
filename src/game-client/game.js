const $ = require("jquery");
const werewolf = require("./werewolf");
const PHARSE = {
  night: 0,
  day: 1
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
var socket = null;
var room = null;

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

module.exports.init = (room, socket) => {
  let infoTag = $(`#info`);
  let controllerTag = $(`#controller`);
  socket = socket;
  username = $(`#username`).text();
  userChar = room.game.characterRole.find(c => c.username == username);
  setPharse(room.game.currentPharse);
  setCharacter();
  infoTag.removeClass("d-none");
  controllerTag.removeClass("d-none");

  werewolfTurn(room);
};

function werewolfTurn(room) {
  room = room;
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
