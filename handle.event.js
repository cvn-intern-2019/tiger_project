const constInit = require("./src/constInit");
const auraSeer = require("./src/game-server/auraseer");
const witch = require("./src/game-server/witch");
const bodyguard = require("./src/game-server/bodyguard");
const hunter = require("./src/game-server/hunter");
const game = require("./src/game-server/game");

function getIdRoom(roomList) {
  let idRoom = null;
  let flag = false;
  let count = 0;

  if (roomList.length == 0) return 0;

  while (!flag) {
    roomList.forEach(r => {
      if (r.id != count) {
        idRoom = count;
        flag = true;
      } else count++;
    });
  }
  return idRoom;
}

function createRoom(host, roomList) {
  let room = {
    id: getIdRoom(roomList),
    name: `Game of ${host}`,
    host: host,
    player: [],
    amount: constInit.AMOUNT_PLAYER,
    status: constInit.WAITING
  };

  roomList.push(room);
  roomList.sort((a, b) => {
    return a.id - b.id;
  });

  return room;
}

module.exports.disconnect = (idSocket, roomList, loungeNsp, roomNsp) => {
  console.log(`=> Someone just disconnected: ${idSocket}`);
  let room = undefined;
  let indexRoom = undefined;
  let player = undefined;

  for (let i = 0; i < roomList.length; i++) {
    player = roomList[i].player.find(p => {
      return p.idSocket == idSocket;
    });

    if (player != undefined) {
      room = roomList[i];
      indexRoom = i;
      break;
    }
  }
  if (room != undefined && player != undefined) {
    let indexPlayer = room.player.findIndex(p => {
      return p.username == player.username;
    });

    room.player.splice(indexPlayer, 1);
    // socket.leave(room.id);
    if (room.player.length == 0) {
      roomList.splice(indexRoom, 1);
    } else {
      if (room.host == player.username) {
        room.host = room.player[0].username;
        room.player[0].isHost = true;
      }
      if (room.status == constInit.WAITING)
        roomNsp.to(room.id).emit("initRoom", room);
      else {
        roomNsp.to(room.id).emit("playerDisconect", room);
      }
    }
    loungeNsp.emit("listRoom", roomList);
  }
};

module.exports.createRoom = (host, socket, roomList) => {
  let room = createRoom(host, roomList);
  socket.emit("createRoom", room);
  socket.broadcast.emit("listRoom", roomList);
};

module.exports.joinRoom = (roomList, socket, data, loungeNsp, roomNsp) => {
  let room = roomList.find(r => r.id == data.idRoom);

  if (room != undefined) {
    let player = room.player.find(p => p.username == data.username);
    if (player != undefined) {
      player.idSocket = socket.id;
      socket.join(data.idRoom);
      roomNsp.to(data.idRoom).emit("initRoom", room);
      loungeNsp.emit("listRoom", roomList);
    }
  }
};

module.exports.startGame = (roomList, idRoom, loungeNsp, roomNsp) => {
  let room = roomList.find(r => r.id == idRoom);
  let randomRole = game.initGame(room.player, roomNsp);
  let gameLog = {
    timeStart: new Date(),
    timeFinish: null,
    currentDay: 1,
    currentPharse: constInit.NIGHT,
    log: new Array(),
    deadList: new Array(),
    characterRole: randomRole,
    resRole: constInit.START,
    survivors: room.amount,
    voteList: new Array()
  };
  room.status = constInit.PLAYING;
  room.gameLog = gameLog;
  loungeNsp.emit("listRoom", roomList);

  var TIME = 1;
  var countDown = setInterval(() => {
    let sysMsg = {
      sender: "System to All",
      receiver: room.id,
      msg: `The game will start in ${TIME} second(s)...`
    };
    roomNsp.to(room.id).emit("recMsg", sysMsg);
    TIME--;
    if (TIME < 0) {
      clearInterval(countDown);
      roomNsp.to(room.id).emit("startGame", room);
    }
  }, 1000);
};

module.exports.characterVote = (roomList, data, roomNsp) => {
  console.log(data);
  console.log(`===============================`);
  let room = roomList.find(r => r.id == data.idRoom);
  let player = room.gameLog.characterRole.find(c => c.username == data.voter);

  if (player.character.id == constInit.ID_CHARACTER.auraSeer) {
    auraSeer(room, data, roomNsp);
    room.gameLog.resRole++;
  }
  if (player.character.id == constInit.ID_CHARACTER.witch) {
    witch(room, data);
    room.gameLog.resRole++;
  }
  if (player.character.id == constInit.ID_CHARACTER.bodyguard) {
    bodyguard(room, data);
    room.gameLog.resRole++;
  }
  if (player.character.id == constInit.ID_CHARACTER.hunter) {
    hunter(room, data);
    room.gameLog.resRole++;
  }

  console.log(room.gameLog.resRole);
  if (game.isNightPharseFinish(room)) {
    game.nightPharseConclusion(room, roomNsp);
  }
};

module.exports.werewolfVote = (roomList, data, roomNsp) => {
  game.werewolfVote(roomNsp, data, roomList);
};

module.exports.votePerson = (roomList, data, roomNsp) => {
  game.votePerson(roomNsp, data, roomList);
};

module.exports.dayPharseFinish = (roomList, idRoom, roomNsp) => {
  let room = roomList.find(r => r.id == idRoom);
  room.gameLog.resRole++;
  if (game.isDayPharseFinish(room)) game.dayPharseConclusion(room, roomNsp);
};

module.exports.sendMsg = (data, roomNsp) => {
  roomNsp.to(data.receiver).emit("recMsg", data);
};
