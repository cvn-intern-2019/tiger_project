const $ = require("jquery");
const PHARSE = {
  night: 0,
  day: 1
};
const TEAM = {
  werewolf: 0,
  villager: 1
};

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

module.exports.setNotify = content => {
  let notifyTag = $(`#notify`);
  notifyTag.text(content);
};

module.exports.setCharacter = userChar => {
  let characterTag = $(`#character`);
  let desTag = $(`#des`);
  characterTag.text(userChar.character.name);
  desTag.text(userChar.character.des);
};

module.exports.selectPerson = flag => {
  if (flag)
    $(`#playerList button`)
      .attr("disabled", false)
      .unbind("click")
      .click(event => {
        if (event.which == 1) {
          let choosenPerson = $(event.target)
            .text()
            .trim();
          if (choosenPerson != username)
            $(`#choosenPerson`).text(choosenPerson);
        }
      });
  else $(`#playerList button`).attr("disabled", true);
};

module.exports.showAllie = (characterList, username) => {
  let allie = characterList.find(
    c => c.username != username && c.character.team == TEAM.werewolf
  );
  let temp = $(`#playerList .player`)
    .find(`button:contains("${allie.username}")`)
    .removeClass("btn-light")
    .addClass("btn-success");
  console.log(temp);
};

module.exports.setPharse = pharse => {
  let pharseNotify = $(`#phase .badge`);
  pharseNotify.text(pharse == PHARSE.night ? "Night" : "Day");
};

module.exports.witchNotify = (save, kill, victim) => {
  let saveNotifyTag = $(`#saveNotify`);
  let killNotifyTag = $(`#killNotify`);
  let saveOptionTag = $(`#saveOption`);
  if (save > 0) {
    if (victim != undefined || victim != null) {
      saveNotifyTag.text(
        `${victim} was killed by Werewolf. Do you want to save?`
      );
    } else {
      saveNotifyTag.text(`No one was killed by Werewolf!`);
      saveOptionTag.addClass("d-none");
    }
  } else {
    saveNotifyTag.text(`You can't save anyone more!`);
    saveOptionTag.addClass("d-none");
  }

  if (kill > 0) {
    killNotifyTag.text(`Choose one person to kill if you want!`);
    this.selectPerson(true);
  } else {
    killNotifyTag.text(`You can't kill anyone more!`);
    this.selectPerson(false);
  }
  killNotifyTag.removeClass("d-none");
  saveNotifyTag.removeClass("d-none");
  $(`#witchFunction`).removeClass("d-none");
};
