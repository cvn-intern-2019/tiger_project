var express = require('express');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lounge', function(req, res, next) {
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
});

router.get('/user/room', function(req, res, next) {

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

});

router.get('/user', function(req, res, next) {
  res.render('user/index', { title: 'Profile' });
});



module.exports = router;
