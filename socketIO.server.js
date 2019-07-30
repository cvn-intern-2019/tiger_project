// var roomList = new Array();
var roomList = [
  {
    id: "000",
    name: "Game of test1",
    host: "test1",
    numPlayer: 7,
    amount: 7,
    status: true
  },
  {
    id: "001",
    name: "Game of test2",
    host: "test2",
    numPlayer: 1,
    amount: 7,
    status: false
  },
  {
    id: "002",
    name: "Game of test3",
    host: "test3",
    numPlayer: 7,
    amount: 7,
    status: true
  }
];

module.exports.init = server => {
  var io = require("socket.io")(server);
  const loungeNsp = io.of("/lounge");
  const roomNsp = io.of("/room");

  // Handle for LOUNGE namespace
  loungeNsp.on("connection", socket => {
    console.log(`=> Someone just connected: ${socket.id}`);
    socket.emit("listRoom", roomList);

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
