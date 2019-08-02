const game = require("./src/game-server/game");
const AMOUNT_PLAYER = 7;
const NIGHT = 0;
const DAY = 1;
const STATUS = {
  alive: 1,
  dead: 0
};
const TEAM = {
  werewolf: 0,
  villager: 1
};
const SWITCH_ROLE = {
  werewolf: 0,
  auraSeer: 1,
  witch: 2,
  bodyguard: 3,
  hunter: 4
};

var roomList = new Array();

function createRoom(username) {
  let room = {
    id: null,
    name: `Game of ${username}`,
    host: username,
    player: [],
    amount: AMOUNT_PLAYER,
    status: false
  };

  let flag = false;
  let count = 0;
  if (roomList.length == 0) room.id = 0;
  else
    while (!flag) {
      roomList.forEach(r => {
        if (r.id != count) {
          room.id = count;
          flag = true;
        } else count++;
      });
    }
  roomList.push(room);
  roomList.sort((a, b) => {
    return a.id - b.id;
  });
  return room;
}

module.exports.isFull = function isFull(id) {
  let result = false;
  roomList.forEach(r => {
    if (r.id == id && r.player.length == r.amount) result = true;
  });
  return result;
};

module.exports.isExist = function isExist(id) {
  let room = roomList.find(r => r.id == id);
  if (room == undefined) return false;
  return true;
};

module.exports.isPlaying = function isPlaying(id) {
  let room = roomList.find(r => r.id == id);
  if (room.status == true) return true;
  return false;
};

module.exports.joinRoom = function joinRoom(id, username) {
  let room = roomList.find(r => r.id == id);

  let player = {
    idSocket: null,
    username: username,
    isHost: room.host == username ? true : false
  };

  if (room.player.find(p => p.username == username) == undefined) {
    room.player.push(player);
  }
};

module.exports.init = server => {
  var io = require("socket.io")(server);
  const loungeNsp = io.of("/lounge");
  const roomNsp = io.of("/room");

  // Handle for LOUNGE namespace
  loungeNsp.on("connection", socket => {
    console.log(`=> Someone just connected: ${socket.id}`);

    //send event show list room
    socket.emit("listRoom", roomList);

    //create room event listen
    socket.on("createRoom", username => {
      let room = createRoom(username, socket.id);
      socket.emit("createRoom", room);
      socket.broadcast.emit("listRoom", roomList);
    });

    socket.on("disconnect", () => {
      console.log(`=> Someone just disconnected: ${socket.id}`);
    });
  });

  // Handle for ROOM namespace
  roomNsp.on("connection", socket => {
    console.log(`=> Someone just connected: ${socket.id}`);

    socket.on("joinRoom", data => {
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
    });

    socket.on("startGame", idRoom => {
      let room = roomList.find(r => r.id == idRoom);
      let randomRole = game.initGame(room.player, roomNsp);
      let gameLog = {
        timeStart: new Date(),
        timeFinish: null,
        currentDay: 1,
        currentPharse: NIGHT,
        log: new Array(),
        deadList: new Array(),
        characterRole: randomRole,
        currentRole: SWITCH_ROLE.werewolf
      };
      room.status = true;
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
          roomNsp.to(idRoom).emit("startGame", room);
        }
      }, 1000);
    });

    socket.on("characterVote", data => {
      console.log(data);
      console.log(`===============================`);
      // let room = roomList.find(r => r.id == data.idRoom);
      // let logElement = {
      //   day: room.gameLog.currentDay,
      //   pharse: room.gameLog.currentPharse,
      //   voter: data.voter,
      //   victim: data.victim
      // };

      // if (
      //   room.gameLog.currentRole == SWITCH_ROLE.werewolf &&
      //   data.victim != null
      // ) {
      //   room.gameLog.deadList.push(data.victim);
      // }

      // if (room.gameLog.currentRole == SWITCH_ROLE.auraSeer) {
      //   let sysMsg = null;
      //   let auraseer = room.player.find(p => p.username == data.voter);
      //   if (data.result == TEAM.werewolf)
      //     sysMsg = {
      //       sender: `System`,
      //       receiver: auraseer.idSocket,
      //       msg: `${data.victim} is Werewolf!`
      //     };
      //   else
      //     sysMsg = {
      //       sender: `System`,
      //       receiver: auraseer.idSocket,
      //       msg: `${data.victim} is not Werewolf!`
      //     };
      //   roomNsp.to(auraseer.idSocket).emit("recMsg", sysMsg);
      // }

      // if (room.gameLog.currentRole == SWITCH_ROLE.witch) {
      //   let witch = room.gameLog.characterRole.find(
      //     c => c.username == data.voter
      //   );
      //   if (data.saveResult == "true") {
      //     witch.character.save--;
      //     logElement.save = room.gameLog.deadList[0];
      //     room.gameLog.deadList.splice(0, 1);
      //   }
      //   if (
      //     data.victim != null &&
      //     !room.gameLog.deadList.includes(data.victim)
      //   ) {
      //     witch.character.kill--;
      //     room.gameLog.deadList.push(data.victim);
      //   }
      //   console.log(witch);
      // }

      // room.gameLog.log.push(logElement);
      // console.log(data);
      // console.log(room.gameLog.log);
      // console.log(`====================HET`);

      // if (room.gameLog.currentRole == 4) {
      //   room = game.pharseConclusion(room);
      //   room.gameLog.currentRole = 0;
      //   roomNsp.to(room.id).emit("end", room);
      //   return;
      // }

      // room.gameLog.currentRole++;

      // switch (room.gameLog.currentRole) {
      //   case SWITCH_ROLE.auraSeer:
      //     roomNsp.to(data.idRoom).emit("auraseerTurn", room);
      //     break;
      //   case SWITCH_ROLE.witch:
      //     roomNsp.to(data.idRoom).emit("witchTurn", room);
      //     break;
      //   case SWITCH_ROLE.bodyguard:
      //     roomNsp.to(data.idRoom).emit("bodyguardTurn", room);
      //     break;
      //   case SWITCH_ROLE.hunter:
      //     roomNsp.to(data.idRoom).emit("hunterTurn", room);
      //     break;
      // }
    });

    socket.on("werewolfVote", data => {
      console.log(data);
      let room = roomList.find(r => r.id == data.idRoom);
      let logElement = {
        day: room.gameLog.currentDay,
        pharse: room.gameLog.currentPharse,
        voter: data.voter,
        victim: data.victim
      };
      if (data.victim != null || data.victim != undefined)
        room.gameLog.deadList.push(data.victim);
      room.gameLog.log.push(logElement);
      roomNsp.to(data.idRoom).emit("werewolfVote", room);
    });

    socket.on("disconnect", () => {
      console.log(`=> Someone just disconnected: ${socket.id}`);
      let room = undefined;
      let indexRoom = undefined;
      let player = undefined;
      for (let i = 0; i < roomList.length; i++) {
        player = roomList[i].player.find(p => {
          return p.idSocket == socket.id;
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
          roomNsp.to(room.id).emit("initRoom", room);
        }
        loungeNsp.emit("listRoom", roomList);
      }
    });

    socket.on("sendMsg", data => {
      roomNsp.to(data.receiver).emit("recMsg", data);
    });
  });
};
