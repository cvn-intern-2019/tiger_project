var socketIOServer = require("../../socketIO.server");
var User = require("../../models/user.model");

module.exports.getRoomPage = (req, res, next) => {
  let idRoom = req.params.idRoom;
  let message =
    "Hello everyone. Wellcom to my room. Are you ready to start game. Please share your feeling to everyone here ";

  if (!socketIOServer.isExist(idRoom)) return res.redirect("/lounge");
  if (socketIOServer.isFull(idRoom)) return res.redirect("/lounge");

  let username = req.session.username;
  User.findOne({ username: username }, (err, user) => {
    if (err) next(err);
    socketIOServer.joinRoom(idRoom, username, user.avatar);
    res.render("user/room", {
      idRoom: idRoom,
      username: req.session.username,
      message: message
    });
  });
};
