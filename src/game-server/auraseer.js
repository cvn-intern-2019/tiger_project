const constInit = require("../constInit");

module.exports = (room, data, roomNsp) => {
  let logElement = {
    day: room.gameLog.currentDay,
    pharse: room.gameLog.currentPharse,
    voter: data.voter,
    victim: data.victim
  };
  let sysMsg = null;
  let auraseerIdSoket = room.player.find(p => p.username == data.voter)
    .idSocket;
  let result = room.gameLog.characterRole.find(c => c.username == data.victim);
  if (result != undefined) {
    if (result.character.team == constInit.TEAM.werewolf)
      sysMsg = {
        sender: `System`,
        receiver: auraseerIdSoket,
        msg: `${data.victim} is Werewolf!`
      };
    else
      sysMsg = {
        sender: `System`,
        receiver: auraseerIdSoket,
        msg: `${data.victim} is not Werewolf!`
      };
    roomNsp.to(auraseerIdSoket).emit("recMsg", sysMsg);
  }
  room.gameLog.log.push(logElement);
};
