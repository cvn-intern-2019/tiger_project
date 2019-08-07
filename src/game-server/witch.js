const constInit = require("../constInit");
module.exports = (room, data) => {
  let logElement = {
    date: room.gameLog.currentDay,
    pharse: room.gameLog.currentPharse,
    voter: data.voter,
    victim: data.victim,
    saveResult: null
  };
  let witch = room.gameLog.characterRole.find(c => c.username == data.voter);
  if (data.saveResult == "true") {
    witch.character.save--;
    logElement.saveResult = room.gameLog.deadList[0];
    room.gameLog.deadList.splice(0, 1);
  }
  if (data.victim != null && !room.gameLog.deadList.includes(data.victim)) {
    witch.character.kill--;
    room.gameLog.deadList.push(data.victim);
  }
  room.gameLog.log.push(logElement);
};
