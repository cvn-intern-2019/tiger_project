const constInit = require("../constInit");
const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  let victim = $(`#playerList .selectedPerson`).attr("id") || null;

  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    idRoom: room.id
  });
};
