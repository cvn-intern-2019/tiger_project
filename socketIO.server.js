const constInit = require("./src/constInit");
const haldeEvent = require("./handle.event");

var roomList = new Array();

module.exports.init = server => {
  var io = require("socket.io")(server);
  const loungeNsp = io.of("/lounge");
  const roomNsp = io.of("/room");

  // Handle for LOUNGE namespace
  loungeNsp.on("connection", socket => {
    console.log(`=> Someone just connected: ${socket.id}`);

    //send event show list room
    socket.emit("listRoom", roomList);

    //create room event listen
    socket.on("createRoom", host => {
      haldeEvent.createRoom(host, socket, roomList);
    });

    socket.on("disconnect", () => {
      console.log(`=> Someone just disconnected: ${socket.id}`);
    });
  });

  // Handle for ROOM namespace
  roomNsp.on("connection", socket => {
    console.log(`=> Someone just connected: ${socket.id}`);

    socket.on("joinRoom", data => {
      haldeEvent.joinRoom(roomList, socket, data, loungeNsp, roomNsp);
    });

    socket.on("startGame", idRoom => {
      haldeEvent.startGame(roomList, idRoom, loungeNsp, roomNsp);
    });

    socket.on("characterVote", data => {
      haldeEvent.characterVote(roomList, data, roomNsp);
    });

    socket.on("werewolfVote", data => {
      haldeEvent.werewolfVote(roomList, data, roomNsp);
    });

    socket.on("votePerson", data => {
      haldeEvent.votePerson(roomList, data, roomNsp);
    });

    socket.on("dayPharseFinish", idRoom => {
      haldeEvent.dayPharseFinish(roomList, idRoom, roomNsp);
    });

    socket.on("disconnect", () => {
      haldeEvent.disconnect(socket.id, roomList, loungeNsp, roomNsp);
    });

    socket.on("sendMsg", data => {
      haldeEvent.sendMsg(data, roomNsp);
    });
  });
};

module.exports.isFull = function isFull(id) {
  let result = false;
  roomList.forEach(r => {
    if (r.id == id && r.player.length == r.amount) result = true;
  });
  return result;
};

module.exports.isExist = function isExist(id) {
  let room = roomList.find(r => r.id == id);
  if (room == undefined) return false;
  return true;
};

module.exports.isPlaying = function isPlaying(id) {
  let room = roomList.find(r => r.id == id);
  if (room.status == constInit.PLAYING) return true;
  return false;
};

module.exports.joinRoom = function joinRoom(id, username) {
  let room = roomList.find(r => r.id == id);

  let player = {
    idSocket: null,
    username: username,
    isHost: room.host == username ? true : false
  };

  if (room.player.find(p => p.username == username) == undefined) {
    room.player.push(player);
  }
};
