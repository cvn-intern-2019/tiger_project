const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var characterSchema = new Schema({
  name: { type: String, required: true, max: 20, min: 1 },
  describe: { type: String, required: false, max: 100, min: 1 },
  team: { type: Number, required: true, enum: [0, 1] }, //0: werewolf team, 1: villager team
  amount: { type: Number, required: true, min: 1 } //amount character in game
});

characterSchema.virtual("team_converted").get(() => {
  return this.team == 0 ? "Werewolf Team" : "Villager Team";
});

module.exports = mongoose.model("Character", characterSchema);
