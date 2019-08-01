const $ = require("jquery");
const helper = require("./helper");
const NIGHT = 0;
const DAY = 1;
var room = null;
var username = null;
var userChar = null;
var socket = null;

function setPharse(pharse) {
  let pharseNotify = $(`#phase .badge`);
  pharseNotify.text(pharse == NIGHT ? "Night" : "Day");
}

function setCharacter() {
  let characterTag = $(`#character`);
  let desTag = $(`#des`);
  characterTag.text(userChar.character.name);
  desTag.text(userChar.character.des);
}

module.exports.init = (room, username, socket) => {
  let infoTag = $(`#info`);
  let controllerTag = $(`#controller`);
  room = room;
  socket = socket;
  username = username;
  userChar = room.game.characterRole.find(c => c.username == username);
  setPharse(room.game.currentPharse);
  setCharacter();
  infoTag.removeClass("d-none");
  controllerTag.removeClass("d-none");
};

function werewolfTurn() {
  let MINUTES = 1;
  let SECONDS = 10;
  var countDown = setInterval(() => {
    let time = helper.countDown(MINUTES, SECONDS);
    MINUTES = time.minutes;
    SECONDS = time.seconds;
    if (MINUTES == 0 && SECONDS == 0) {
      clearInterval(countDown);
    }
  }, 1000);
}
