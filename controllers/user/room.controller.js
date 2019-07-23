var express = require('express');
var router = express.Router();

exports.getRoomPage = (req, res, next)=>{
  
    var players = [
        {
          username : "HoangNhi",
          id : 1
        },
        {
          username : "HongMo",
          id : 2
        },
        {
          username : "TuPhi",
          id : 3
        },
        {
          username : "ThuQuyen",
          id : 4
        },
        {
          username : "KieuNgan",
          id : 5
        }
    ]
    
    res.render('user/room', { title: 'Room', players: players });

}

    
  