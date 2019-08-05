var helper = require("./helper");

module.exports.index = (req, res, next) => {
  let username = req.session.username;
  global.socketAuthToken = helper.generateToken();
  res.render("lounge", {
    username: username,
    socketAuthToken: socketAuthToken
  });
};
