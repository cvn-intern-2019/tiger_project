const helper = require("./helper");
const ID_WEREWOLF = {
  alpha: 0,
  normal: 1
};
const $ = require("jquery");

module.exports = (socket, userChar, idRoom) => {
  if (userChar.character.id == ID_WEREWOLF.alpha) {
    let victim = $(`#playerList .selectedPerson`).attr("id") || null;

    socket.emit("werewolfVote", {
      voter: userChar.username,
      victim: victim,
      idRoom: idRoom
    });
  }
};
