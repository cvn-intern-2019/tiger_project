const helper = require("./helper");
const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  let victim = $(`#playerList .selectedPerson`).attr("id") || null;
  let saveResult = $(`#controller #saveBox`).text() || null;

  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    saveResult: saveResult,
    idRoom: room.id
  });
};
