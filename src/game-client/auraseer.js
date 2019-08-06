const helper = require("./helper");
const $ = require("jquery");

module.exports.vote = (socket, userChar, room) => {
  let victim = $(`#playerList .selectedPerson`).attr("id") || null;

  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    idRoom: room.id
  });
};

module.exports.action = () => {
  let username = $(`#username`)
    .text()
    .trim();
  let userChar = room.gameLog.characterRole.find(c => c.username == username);
  helper.selectPerson(true, userChar.username);
  helper.setNotify(
    "Choose one person who you want to know!",
    "notify",
    "bottom left",
    "20000"
  );
};
