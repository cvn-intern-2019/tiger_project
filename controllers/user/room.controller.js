var socketIOServer = require("../../socketIO.server");

module.exports.getRoomPage = (req, res, next) => {
  let idRoom = req.params.idRoom;
  let message = "Hello everyone. Wellcom to my room. Are you ready to start game. Please share your feeling to everyone here "

  if (!socketIOServer.isExist(idRoom)) return res.redirect("/lounge");
  if (socketIOServer.isFull(idRoom)) return res.redirect("/lounge");

  let username = req.session.username;
  socketIOServer.joinRoom(idRoom, username);
  res.render("user/room", {
    idRoom: idRoom,
    username: req.session.username,
    message : message
  });
};
