const constInit = require("../constInit");
module.exports = (room, data) => {
  let logElement = {
    date: room.gameLog.currentDay,
    pharse: room.gameLog.currentPharse,
    voter: data.voter,
    victim: data.victim
  };
  room.gameLog.log.push(logElement);
};
