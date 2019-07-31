const characters = require("./characters.json");

module.exports.initGame = playerList => {
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
      status: 1 //1: live, 0: die
    });
    idChar.splice(index, 1);
  });
  return playerChar;
};
