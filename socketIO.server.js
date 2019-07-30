// var roomList = new Array();
const AMOUNT_PLAYER = 7;

var roomList = new Array();

function createRoom(username, socketRoomId) {
  let room = {
    id: null,
    name: `Game of ${username}`,
    host: username,
    player: [],
    amount: AMOUNT_PLAYER,
    status: false
  };

  let flag = false;
  let count = 0;
  if (roomList.length == 0) room.id = 0;
  else
    while (!flag) {
      roomList.forEach(r => {
        if (r.id != count) {
          room.id = count;
          flag = true;
        } else count++;
      });
    }
  roomList.push(room);
  roomList.sort((a, b) => {
    return a.id - b.id;
  });
  return room;
}

module.exports.isFull = function isFull(id) {
  let result = false;
  roomList.forEach(r => {
    if (r.id == id && r.player.length == r.amount) result = true;
  });
  return result;
};

module.exports.isExist = function isExist(id) {
  let index = roomList.findIndex(r => {
    return r.id == id;
  });
  if (index >= 0) return true;
  return false;
};

module.exports.joinRoom = function joinRoom(id, username, avatar) {
  let index = roomList.findIndex(r => {
    return r.id == id && r.host == username;
  });
  let player = {
    idSocket: null,
    username: username,
    avatar: avatar,
    isHost: index >= 0 ? true : false
  };
  roomList.find(r => r.id == id).player.push(player);
};

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
    socket.on("createRoom", username => {
      let room = createRoom(username, socket.id);
      socket.emit("createRoom", room);
      socket.broadcast.emit("listRoom", roomList);
    });

    socket.on("disconnect", () => {
      console.log(`=> Someone just disconnected: ${socket.id}`);
    });
  });

  // Handle for ROOM namespace
  roomNsp.on("connection", socket => {
    console.log(`=> Someone just connected: ${socket.id}`);

    socket.on("joinRoom", data => {
      let room = roomList.find(r => r.id == data.idRoom);
      socket.join(data.idRoom);
      room.player.forEach(p => {
        if (p.username == data.username) p.idSocket = socket.id;
      });
      roomNsp.to(data.idRoom).emit("joinRoom", room);
    });
    socket.on("disconnect", () => {
      console.log(`=> Someone just disconnected: ${socket.id}`);
    });
  });
};
