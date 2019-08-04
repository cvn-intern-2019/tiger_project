const ALIVE = 1;
const DEAD = 0;
const TEAM = {
  werewolf: 0,
  villager: 1
};
const PLAYING = false;
const WAITING = true;
const AMOUNT_PLAYER = 7;
const NIGHT = 0;
const DAY = 1;

const ID_CHARACTER = {
  alphaWerewof: 0,
  werewolf: 1,
  auraSeer: 2,
  witch: 3,
  bodyguard: 4,
  hunter: 5,
  villager: 6
};
const START = 0;

const WIN_CONDITION = {
  werewolfWin: 0,
  villagerWin: 1,
  draw: -1
};

module.exports = {
  START: START,
  ID_CHARACTER: ID_CHARACTER,
  ALIVE: ALIVE,
  DEAD: DEAD,
  TEAM: TEAM,
  AMOUNT_PLAYER: AMOUNT_PLAYER,
  NIGHT: NIGHT,
  DAY: DAY,
  WIN_CONDITION: WIN_CONDITION,
  PLAYING: PLAYING,
  WAITING: WAITING
};
