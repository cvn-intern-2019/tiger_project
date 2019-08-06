var helper = require("./helper");

module.exports.index = (req, res, next) => {
  let username = req.session.username;
  res.render("lounge", {
    username: username
  });
};
