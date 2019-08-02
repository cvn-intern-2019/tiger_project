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

  roomNsp.to(room.id).emit("nightPharseFinish", room);

  room.gameLog.resRole = constInit.START;
  deadList = new Array();
  room.currentPharse = constInit.DAY;
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

module.exports.dayPharseConclusion = (room, roomNsp) => {
  let voteList = room.gameLog.voteList;
  let voteMaxPlayer = findMaxVotePlayer(voteList);

  let victim = room.gameLog.characterRole.find(
    c => c.username == voteMaxPlayer.target
  );
  if (victim != undefined) victim.status = constInit.DEAD;

  let logElement = {
    day: room.gameLog.currentDay,
    pharse: room.gameLog.currentPharse,
    voter: "All",
    victim: victim.username
  };

  room.gameLog.log.push(logElement);

  if (
    checkWinCondition(room.gameLog.characterRole) ==
    constInit.WIN_CONDITION.werewolfWin
  ) {
    room.gameLog.timeFinish = new Date();
    roomNsp.to(room.id).emit("werewolfWin", room);
    return;
  }

  if (
    checkWinCondition(room.gameLog.characterRole) ==
    constInit.WIN_CONDITION.villagerWin
  ) {
    room.gameLog.timeFinish = new Date();
    roomNsp.to(room.id).emit("villagerWin", room);
    return;
  }

  if (
    checkWinCondition(room.gameLog.characterRole) ==
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

function findMaxVotePlayer(voteList) {
  let voteSum = new Array();
  voteList.forEach(v => {
    let temp = voteSum.find(vs => vs.target == v.target);
    if (temp == undefined) {
      voteSum.push({ target: v.target, voteNum: 1 });
    } else temp.voteNum++;
  });

  const voteMax = voteSum.reduce(function(prev, current) {
    return prev.voteNum > current.voteNum ? prev : current;
  });

  return voteMax;
}

function checkWinCondition(characterRole) {
  let werewolfTeam = 0;
  let villagerTeam = 0;
  if (
    characterRole.find(
      c =>
        c.character.id == constInit.ID_CHARACTER.alphaWerewof &&
        c.status == constInit.ALIVE
    ) == undefined
  ) {
    let firstWerewolf = characterRole.find(
      c => c.character.id == constInit.ID_CHARACTER.werewolf
    );
    console.log(firstWerewolf);
    let alphaWerewof = characters.find(
      c => c.id == constInit.ID_CHARACTER.alphaWerewof
    );
    if (firstWerewolf != undefined) firstWerewolf.character = alphaWerewof;
  }
  characterRole.forEach(c => {
    if (
      c.character.team == constInit.TEAM.werewolf &&
      c.status == constInit.ALIVE
    ) {
      werewolfTeam++;
    }
    if (
      c.character.team == constInit.TEAM.villager &&
      c.status == constInit.ALIVE
    )
      villagerTeam++;
  });
  if (werewolfTeam >= villagerTeam) return constInit.WIN_CONDITION.werewolfWin;
  if (werewolfTeam == 0) return constInit.WIN_CONDITION.villagerWin;
  return constInit.WIN_CONDITION.draw;
}
