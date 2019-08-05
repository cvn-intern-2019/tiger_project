const helper = require("./helper");
const constInit = require("../constInit");
const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  if (userChar.status == constInit.ALIVE) {
    if (userChar.character.id == constInit.ID_CHARACTER.alphaWerewof) {
      let victim = $(`#playerList .selectedPerson`).attr("id") || null;

      socket.emit("werewolfVote", {
        voter: userChar.username,
        victim: victim,
        idRoom: room.id
      });
    } else if (userChar.character.id == constInit.ID_CHARACTER.werewolf) {
      let alphaWerewof = room.gameLog.characterRole.find(
        c =>
          c.character.id == constInit.ID_CHARACTER.alphaWerewof &&
          c.status == constInit.ALIVE
      );
      if (alphaWerewof == undefined) {
        let victim = $(`#playerList .selectedPerson`).attr("id") || null;

        socket.emit("werewolfVote", {
          voter: userChar.username,
          victim: victim,
          idRoom: room.id
        });
      }
    }
  }
};
