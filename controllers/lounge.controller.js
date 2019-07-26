
module.exports.getRoomPage = (req, res, next) => {

  var rooms = [
    {
      roomID: 1,
      roomAuthor: "phanmai",
      roomNumPlayers: 10
    },
    {
      roomID: 2,
      roomAuthor: "test1",
      roomNumPlayers: 8
    },
    {
      roomID: 3,
      roomAuthor: "maiphan2",
      roomNumPlayers: 10
    },
    {
      roomID: 4,
      roomAuthor: "maiphan4",
      roomNumPlayers: 8
    },
    {
      roomID: 5,
      roomAuthor: "test2",
      roomNumPlayers: 10
    },
    {
      roomID: 6,
      roomAuthor: "m123245",
      roomNumPlayers: 8
    },
    {
      roomID: 7,
      roomAuthor: "phanmai0",
      roomNumPlayers: 10
    },
    {
      roomID: 8,
      roomAuthor: "Nhat",
      roomNumPlayers: 8
    }
  ];

  res.render("lounge", { title: "Lounge", rooms: rooms });
};

module.exports.index = (req, res, next) => {
  res.redirect("/lounge");
};
