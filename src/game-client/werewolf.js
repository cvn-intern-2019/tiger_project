const helper = require("./helper");
const ID_WEREWOLF = {
  alpha: 0,
  normal: 1
};
const $ = require("jquery");

module.exports = (socket, userChar, idRoom) => {
  if (userChar.character.id == ID_WEREWOLF.alpha) {
    let victim = $(`#choosenPerson`).text();
    socket.emit("werewolfVote", {
      voter: userChar.username,
      victim: victim,
      idRoom: idRoom
    });
  }
};
