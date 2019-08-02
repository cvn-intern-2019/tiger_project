const constInit = require("./constInit");
const characters = require("./characters.json");

module.exports.initGame = (playerList, roomNsp) => {
  return randomCharacter(playerList);
};

//random character with each player
var randomCharacter = playerList => {
  let idChar = new Array();
  let playerChar = new Array();

  characters.forEach(c => {
    for (var i = 0; i < c.amount; i++) {
      idChar.push(c.id);
    }
  });

  playerList.forEach(p => {
    let index = Math.floor(Math.random() * (idChar.length - 1 - 0) + 0);
    let character = characters.find(c => c.id == idChar[index]);
    playerChar.push({
      username: p.username,
      character: character,
      status: constInit.ALIVE //1: live, 0: die
    });
    idChar.splice(index, 1);
  });
  return playerChar;
};

module.exports.nightPharseConclusion = (room, roomNsp) => {
  let log = room.gameLog.log;
  let deadList = room.gameLog.deadList;
  let characterRole = room.gameLog.characterRole;

  let hunter = characterRole.find(
    c => c.character.id == constInit.ID_CHARACTER.hunter
  );
  let bodyguard = characterRole.find(
    c => c.character.id == constInit.ID_CHARACTER.bodyguard
  );

  if (hunter.status == constInit.ALIVE && deadList.includes(hunter.username)) {
    let log = log.find(
      l =>
        l.day == room.currentDay &&
        l.pharse == room.currentPharse &&
        l.voter == hunter.username
    );
    if (log != undefined)
      if (
        log.victim != undefined &&
        log.victim != null &&
        !deadList.includes(log.victim)
      ) {
        deadList.push(log.victim);
      }

    log = log.find(
      l =>
        l.day == room.currentDay &&
        l.pharse == room.currentPharse &&
        l.voter == bodyguard.username
    );
    if (deadList.includes(log.victim)) {
      let index = deadList.findIndex(d => {
        return d == target;
      });
      deadList.splice(index, 1);
    }
  }

  characterRole.forEach(c => {
    if (deadList.includes(c.username)) c.status = constInit.DEAD;
  });

  room.currentPharse = constInit.DAY;
  roomNsp.to(room.id).emit("nightPharseFinish", room);
};

module.exports.werewolfVote = (roomNsp, data, roomList) => {
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
};

module.exports.isNightPharseFinish = room => {
  let resRole = room.gameLog.resRole;
  let survivors = 0;
  room.gameLog.characterRole.forEach(c => {
    if (
      c.status == constInit.ALIVE &&
      c.character.team != constInit.TEAM.werewolf &&
      c.character.id != 6
    )
      survivors++;
  });
  if (resRole == survivors) return true;
  return false;
};
