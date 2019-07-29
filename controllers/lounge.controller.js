module.exports.getRoomPage = (req, res, next) => {
  var rooms = [
    {
      roomID: 1,
      roomAuthor: "phanmai",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 2,
      roomAuthor: "test1",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 3,
      roomAuthor: "maiphan2",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 4,
      roomAuthor: "maiphan4",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 5,
      roomAuthor: "test2",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 6,
      roomAuthor: "m123245",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 7,
      roomAuthor: "phanmai0",
      roomNumPlayers: 5,
      totalPlayers: 7
    },
    {
      roomID: 8,
      roomAuthor: "Nhat",
      roomNumPlayers: 5,
      totalPlayers: 7
    }
  ];
  let username = req.session.username;
  res.render("lounge", { title: "Lounge", username: username, rooms: rooms });
};

module.exports.index = (req, res, next) => {
  res.redirect("/lounge");
};
