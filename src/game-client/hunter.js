const helper = require("./helper");

const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  let victim = $(`#choosenPerson`).text();

  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    idRoom: room.id
  });
};
