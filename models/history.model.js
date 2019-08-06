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
      day: { type: Number, min: 1, required: false },
      pharse: { type: Number, enum: [0, 1], required: false },
      voter: { type: String, required: false },
      victim: { type: String, required: false }
    }
  ]
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
