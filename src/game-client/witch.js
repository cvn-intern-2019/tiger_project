const helper = require("./helper");
const $ = require("jquery");

module.exports.vote = (socket, userChar, room) => {
  let victim = $(`#playerList .selectedPerson`).attr("id") || null;
  let saveResult = $(`#controller #saveResult`).text() || null;
  $(`#controller #saveResult`).remove();
  console.log(saveResult);
  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    saveResult: saveResult,
    idRoom: room.id
  });
};

module.exports.action = room => {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  helper.selectPerson(true, userChar.username);
  let victim = room.gameLog.deadList[0];
  helper.witchNotify(victim, userChar);
};
