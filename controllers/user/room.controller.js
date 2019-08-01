var socketIOServer = require("../../socketIO.server");
var User = require("../../models/user.model");

module.exports.getRoomPage = (req, res, next) => {
  let idRoom = req.params.idRoom;

  if (socketIOServer.isExist(idRoom) == false) return res.redirect("/lounge");
  if (socketIOServer.isFull(idRoom)) return res.redirect("/lounge");

  let username = req.session.username;

  socketIOServer.joinRoom(idRoom, username);
  res.render("user/room", {
    idRoom: idRoom,
    username: req.session.username
  });
};
