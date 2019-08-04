const constInit = require("../constInit");
const characters = require("../game-server/characters.json");

var generateRandomInteger = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

//random character with each player
module.exports.randomCharacter = (playerList, characters) => {
  let idChar = new Array();
  let playerChar = new Array();

  characters.forEach(c => {
    for (var i = 0; i < c.amount; i++) {
      idChar.push(c.id);
    }
  });

  playerList.forEach(p => {
    let index = generateRandomInteger(idChar.length);
    console.log(index);
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

module.exports.findMaxVotePlayer = voteList => {
  let voteSum = new Array();
  let voteMax = new Array();

  voteList.forEach(v => {
    let collector = voteSum.find(vs => vs.target == v.target);
    if (collector == undefined) {
      voteSum.push({ target: v.target, voteNum: 1 });
    } else collector.voteNum++;
  });

  for (let i = 0; i < voteSum.length; i++) {
    if (voteMax.length == 0) {
      voteMax.push(voteSum[i]);
      continue;
    }
    if (voteSum[i].voteNum == voteMax[0].voteNum) {
      voteMax.push(voteSum[i]);
      continue;
    }
    if (voteSum[i].voteNum > voteMax[0].voteNum) {
      voteMax = new Array();
      voteMax.push(voteSum[i]);
    }
  }

  let victimIndex = generateRandomInteger(voteMax.length);
  console.log(voteMax[victimIndex]);
  return voteMax[victimIndex];
};

module.exports.checkWinCondition = characterRole => {
  let werewolfTeam = 0;
  let villagerTeam = 0;

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
};
