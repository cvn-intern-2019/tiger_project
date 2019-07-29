// var roomList = new Array();
const AMOUNT_PLAYER = 7;

var roomList = new Array();

function createRoom(username, socketRoomId) {
  let room = {
    id: null,
    socketRoomId: socketRoomId,
    name: `Game of ${username}`,
    host: username,
    numPlayer: 1,
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
    socket.on("disconnect", () => {
      console.log(`=> Someone just disconnected: ${socket.id}`);
    });
  });
};
