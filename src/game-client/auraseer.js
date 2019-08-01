const helper = require("./helper");
const RESULT = {
  werewolf: 0,
  villager: 1
};
const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  let MINUTES = 0;
  let SECONDS = 10;
  var countDown = setInterval(() => {
    let time = helper.countDown(MINUTES, SECONDS);
    MINUTES = time.minutes;
    SECONDS = time.seconds;
    if (MINUTES == 0 && SECONDS == 0) {
      clearInterval(countDown);

      let victim = $(`#choosenPerson`).text();
      let result = null;
      if (victim != "") {
        result = room.gameLog.characterRole.find(c => c.username == victim);
        if (result.character.team == RESULT.werewolf) {
          $(`#notify`).text(`${victim} is Werewolf`);
        } else {
          $(`#notify`).text(`${victim} is not Werewolf`);
        }
      }
      socket.emit("characterVote", {
        voter: userChar.username,
        victim: victim,
        idRoom: room.id
      });
    }
  }, 1000);
};
