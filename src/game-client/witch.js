const helper = require("./helper");
const $ = require("jquery");

module.exports.vote = (socket, room) => {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  let victim = $(`#playerList .selectedPerson`).attr("id") || null;
  let saveResult = $(`#controller #saveResult`).text() || null;
  $(`#controller #saveResult`).remove();
  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    saveResult: saveResult,
    idRoom: room.id
  });
  $(`#saveBox`).attr("disabled", false);
};

module.exports.action = room => {
  $(`#saveBox`).attr("disabled", true);
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  let victim = room.gameLog.deadList[0];
  helper.witchNotify(victim, userChar);
};
