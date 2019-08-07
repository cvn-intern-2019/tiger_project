const mongoose = require("mongoose");
const moment = require("moment");

var Schema = mongoose.Schema;

var historySchema = new Schema({
  timeStart: { type: Date, required: true },
  timeFinish: { type: Date, required: true },
  result: { type: Number, required: true, enum: [0, 1] },
  players: [
    {
      username: { type: String, required: false },
      character: { type: String, required: false },
      _id: false
    }
  ],
  details: [
    {
      date: { type: Number, min: 1, required: false },
      pharse: { type: Number, enum: [0, 1], required: false },
      voter: { type: String, required: false },
      victim: { type: String, required: false },
      saveResult: { type: String, require: false, default: undefined },
      _id: false
    }
  ]
});

// virtual attribute timeStart_formatted
historySchema.virtual("timeStart_formatted").get(function() {
  return moment(this.timeStart).format("LTS DD/MM/YYYY");
});

// virtual attribute timeFinish to timeFinish_formatted
historySchema.virtual("timeFinish_formatted").get(function() {
  return moment(this.timeFinish).format("LTS DD/MM/YYYY");
});

module.exports = mongoose.model("History", historySchema);
