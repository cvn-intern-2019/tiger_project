const constInit = require("./constInit");
module.exports = (room, data) => {
  let logElement = {
    day: room.gameLog.currentDay,
    pharse: room.gameLog.currentPharse,
    voter: data.voter,
    victim: data.victim
  };
  room.gameLog.log.push(logElement);
};
