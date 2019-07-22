const mongoose = require("mongoose");
const moment = require("moment");

var Schema = mongoose.Schema;

var invitationSchema = new Schema({
  idSend: {
    type: Schema.Types.ObjectId,
    rel: "User",
    required: true
  },
  idRec: {
    type: Schema.Types.ObjectId,
    rel: "User",
    required: true
  },
  time: { type: Date, required: true }
});

invitationSchema.virtual("time_formatted").get(() => {
  return moment(this.time).format("HH:MM:ss DD/MM/YYYY");
});

module.exports = mongoose.model("Invitation", invitationSchema);
