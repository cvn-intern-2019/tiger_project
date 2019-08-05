const constInit = require("../constInit");
const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  let victim = $(`#playerList .selectedPerson`).attr("id") || null;
  let saveResult = $(`#controller #saveResult`).text() || null;
  console.log(saveResult);
  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    saveResult: saveResult,
    idRoom: room.id
  });
};
