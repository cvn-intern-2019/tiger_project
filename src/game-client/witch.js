const helper = require("./helper");
const $ = require("jquery");

module.exports.kill = (socket, userChar, room, saveResult) => {
  let MINUTES = 0;
  let SECONDS = 10;
  var countDown = setInterval(() => {
    let time = helper.countDown(MINUTES, SECONDS);
    MINUTES = time.minutes;
    SECONDS = time.seconds;
    if (MINUTES == 0 && SECONDS == 0) {
      clearInterval(countDown);

      let victim = $(`#choosenPerson`).text();

      socket.emit("characterVote", {
        voter: userChar.username,
        victim: victim,
        saveResult: saveResult,
        idRoom: room.id
      });
    }
  }, 1000);
};
