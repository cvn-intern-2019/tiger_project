var socketIOServer = require("../../socketIO.server");
var User = require("../../models/user.model");
var helper = require("../helper");
module.exports.getRoomPage = (req, res, next) => {
  let idRoom = req.params.idRoom;

  if (socketIOServer.isExist(idRoom) == false) return res.redirect("/lounge");
  if (socketIOServer.isFull(idRoom)) return res.redirect("/lounge");
  if (socketIOServer.isPlaying(idRoom)) return res.redirect("/lounge");

  let username = req.session.username;
  global.socketAuthToken = helper.generateToken();

  socketIOServer.joinRoom(idRoom, username);
  res.render("user/room", {
    idRoom: idRoom,
    username: req.session.username,
    socketAuthToken: socketAuthToken
  });
};
