const mongoose = require("mongoose");
const moment = require("moment");

var Schema = mongoose.Schema;

var historySchema = new Schema({
  timeStart: { type: Date, required: true },
  timeFinish: { type: Date, required: true },
  result: { type: Number, required: true, enum: [0, 1] },
  players: [
    {
      playerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
      characterId: {
        type: Schema.Types.ObjectId,
        ref: "Character",
        required: true
      }
    }
  ],
  details: { type: String, required: false }
});

// virtual attribute timeStart_formatted
historySchema.virtual("timeStart_formatted").get(() => {
  return moment(this.timeStart).format("HH:MM:ss DD/MM/YYYY");
});

// virtual attribute timeFinish to timeFinish_formatted
historySchema.virtual("timeFinish_formatted").get(() => {
  return moment(this.timeFinish).format("HH:MM:ss DD/MM/YYYY");
});

module.exports = mongoose.model("History", historySchema);
