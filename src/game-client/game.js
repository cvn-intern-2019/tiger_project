const $ = require("jquery");
const werewolf = require("./werewolf");
const auraseer = require("./auraseer");
const witch = require("./witch");
const helper = require("./helper");
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
      setNotify("Choose one person who you want :D");
      selectPerson();
      auraseer(socket, userChar, room);
    }
  } else {
    $(`#playerList button`).attr("disabled", true);
  }
};

module.exports.witchTurn = (room, socket) => {
  setNotify("Witch is active >.<");

  if (userChar.status == STATUS.alive) {
    $(`#playerList button`).attr("disabled", true);
    if (userChar.character.id == ID_CHARACTER.witch) {
      let victim = room.gameLog.deadList[0];

      if (userChar.character.save > 0) {
        if (victim != undefined || victim != null) {
          setNotify(`${victim} was killed by Werewolf. Do you want to save?`);
          $(`#witchFunction`).removeClass("d-none");
        } else {
          setNotify(`No one was killed!`);
        }
      } else {
        setNotify(`You can't save anyone more!`);
        $(`#witchFunction`).empty();
      }

      let MINUTES = 0;
      let SECONDS = 10;
      var save = setInterval(() => {
        let time = helper.countDown(MINUTES, SECONDS);
        MINUTES = time.minutes;
        SECONDS = time.seconds;
        if (MINUTES == 0 && SECONDS == 0) {
          clearInterval(save);
          let saveResult = $(
            `#witchFunction .radio input[name=save]:checked`
          ).val();
          $(`#witchFunction`).addClass("d-none");

          if (userChar.character.kill > 0) {
            setNotify(`Choose one person to kill if you want!`);
            selectPerson();
          } else {
            setNotify(`You can't kill anyone more!`);
          }
          witch.kill(socket, userChar, room, saveResult);
        }
      }, 1000);
    }
  } else {
    $(`#playerList button`).attr("disabled", true);
  }
};
