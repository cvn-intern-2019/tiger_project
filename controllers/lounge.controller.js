var express = require('express');
var router = express.Router();

exports.getRoomPage = (req, res,next)=>{
  
    var rooms = [
        {
            roomID : 1,
            roomAuthor : "HoangNhi",
            roomNumPlayers : 10
        },
        {
            roomID : 2,
            roomAuthor : "TuPhi",
            roomNumPlayers : 8
        },
        {
          roomID : 3,
          roomAuthor : "ThuQuyen",
          roomNumPlayers : 10
        },
        {
          roomID : 4,
          roomAuthor : "HongMo",
          roomNumPlayers : 8
        },
        {
          roomID : 5,
          roomAuthor : "Poon",
          roomNumPlayers : 10
      },
      {
          roomID : 6,
          roomAuthor : "Duy",
          roomNumPlayers : 8
      },
      {
        roomID : 7,
        roomAuthor : "Nam",
        roomNumPlayers : 10
      },
      {
        roomID : 8,
        roomAuthor : "Nhat",
        roomNumPlayers : 8
      }
    
    ];
    
    res.render('lounge', { title: 'Lounge', rooms: rooms });
}

exports.index = (req, res,next)=>{
    res.redirect("/lounge");
}
