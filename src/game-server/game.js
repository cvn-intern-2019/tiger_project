const constInit = require("../constInit");
const characters = require("./characters.json");
const helper = require("./helper");

module.exports.initGame = (playerList, roomNsp) => {
  return helper.randomCharacter(playerList, characters);
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

  let logItem = log.find(
    l =>
      l.day == room.gameLog.currentDay &&
      l.pharse == room.gameLog.currentPharse &&
      l.voter == bodyguard.username
  );

  if (logItem != undefined)
    if (deadList.includes(logItem.victim)) {
      let index = deadList.findIndex(d => {
        return d == logItem.victim;
      });
      deadList.splice(index, 1);
    }

  if (hunter.status == constInit.ALIVE && deadList.includes(hunter.username)) {
    logItem = log.find(
      l =>
        l.day == room.gameLog.currentDay &&
        l.pharse == room.gameLog.currentPharse &&
        l.voter == hunter.username
    );
    if (logItem != undefined)
      if (
        logItem.victim != undefined &&
        logItem.victim != null &&
        !deadList.includes(logItem.victim)
      ) {
        deadList.push(logItem.victim);
      }
  }

  characterRole.forEach(c => {
    if (deadList.includes(c.username)) c.status = constInit.DEAD;
  });

  room.gameLog.resRole = constInit.START;
  room.gameLog.deadList = new Array();
  room.gameLog.currentPharse = constInit.DAY;

  roomNsp.to(room.id).emit("nightPharseFinish", room);
};

module.exports.werewolfVote = (roomNsp, data, roomList) => {
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
  console.log("trả về sói vote");
  roomNsp.to(data.idRoom).emit("werewolfVote", room);
};

module.exports.isNightPharseFinish = room => {
  let resRole = room.gameLog.resRole;
  let survivors = 0;
  room.gameLog.characterRole.forEach(c => {
    if (
      c.status == constInit.ALIVE &&
      c.character.team != constInit.TEAM.werewolf &&
      c.character.id != constInit.ID_CHARACTER.villager
    )
      survivors++;
  });
  if (resRole == survivors) return true;
  return false;
};

module.exports.votePerson = (roomNsp, data, roomList) => {
  let room = roomList.find(r => r.id == data.idRoom);
  let voteList = room.gameLog.voteList;
  let voteElement = voteList.find(e => e.voter == data.voter);
  if (voteElement != undefined) voteElement.target = data.target;
  else {
    voteElement = {
      voter: data.voter,
      target: data.target
    };
    voteList.push(voteElement);
  }

  roomNsp.to(data.idRoom).emit("voteResult", room);
};

module.exports.isDayPharseFinish = room => {
  let resRole = room.gameLog.resRole;
  let survivors = 0;
  room.gameLog.characterRole.forEach(c => {
    if (c.status == constInit.ALIVE) survivors++;
  });
  if (resRole == survivors) return true;
  return false;
};

module.exports.dayPharseConclusion = (roomList, room, roomNsp, loungeNsp) => {
  let voteList = room.gameLog.voteList;
  let voteMaxPlayer = helper.findMaxVotePlayer(voteList);
  let logElement = {
    day: room.gameLog.currentDay,
    pharse: room.gameLog.currentPharse,
    voter: "All",
    victim: null
  };
  if (voteMaxPlayer != undefined) {
    let victim = room.gameLog.characterRole.find(
      c => c.username == voteMaxPlayer.target
    );

    if (victim != undefined) victim.status = constInit.DEAD;
    logElement.victim = victim.target;
  }

  room.gameLog.log.push(logElement);
  if (
    helper.checkWinCondition(room.gameLog.characterRole) ==
    constInit.WIN_CONDITION.werewolfWin
  ) {
    room.gameLog.timeFinish = new Date();
    room.status = constInit.WAITING;
    roomNsp.to(room.id).emit("werewolfWin", room);
    loungeNsp.emit("listRoom", roomList);
    return;
  }

  if (
    helper.checkWinCondition(room.gameLog.characterRole) ==
    constInit.WIN_CONDITION.villagerWin
  ) {
    room.gameLog.timeFinish = new Date();
    room.status = constInit.WAITING;
    roomNsp.to(room.id).emit("villagerWin", room);
    loungeNsp.emit("listRoom", roomList);
    return;
  }

  if (
    helper.checkWinCondition(room.gameLog.characterRole) ==
    constInit.WIN_CONDITION.draw
  ) {
    room.gameLog.voteList = new Array();
    room.gameLog.resRole = constInit.START;
    room.gameLog.currentPharse = constInit.NIGHT;
    room.gameLog.currentDay++;
    roomNsp.to(room.id).emit("dayPharseFinish", room);
    return;
  }
};
