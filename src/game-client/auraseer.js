const helper = require("./helper");

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
      let result = room.gameLog.characterRole.find(c => c.username == victim);

      socket.emit("characterVote", {
        voter: userChar.username,
        victim: victim,
        idRoom: room.id,
        result: result.character.team
      });
    }
  }, 1000);
};