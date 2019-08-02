const helper = require("./helper");
const $ = require("jquery");

module.exports = (socket, userChar, room) => {
  let victim = $(`#choosenPerson`).text();
  let saveResult = $(`#saveOption input[name=save]:checked`).val();

  socket.emit("characterVote", {
    voter: userChar.username,
    victim: victim,
    saveResult: saveResult,
    idRoom: room.id
  });

  $(`#killNotify, #witchFunction`).addClass("d-none");
};
