const helper = require("./helper");
const ID_WEREWOLF = {
  alpha: 0,
  normal: 1
};
const $ = require("jquery");

module.exports = (socket, userChar, idRoom) => {
  let MINUTES = 0;
  let SECONDS = 30;
  var countDown = setInterval(() => {
    let time = helper.countDown(MINUTES, SECONDS);
    MINUTES = time.minutes;
    SECONDS = time.seconds;
    if (MINUTES == 0 && SECONDS == 0) {
      clearInterval(countDown);
      if (userChar.character.id == ID_WEREWOLF.alpha) {
        let victim = $(`#choosenPerson`).text();
        socket.emit("characterVote", {
          voter: userChar.username,
          victim: victim,
          idRoom: idRoom
        });
      }
    }
  }, 1000);
};
