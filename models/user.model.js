const mongoose = require("mongoose");
const moment = require("moment");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, max: 20, min: 5 },
  password: { type: String, required: true, max: 20, min: 5 },
  fullname: { type: String, required: false, max: 50, min: 5 },
  gender: { type: Boolean, required: false, enum: [true, false] },
  email: { type: String, required: false, max: 100, min: 5 },
  phone: { type: String, required: false, max: 10, min: 10 },
  birthday: { type: Date, required: false },
  friendId: [{ type: Schema.Types.ObjectId, ref: "User", required: false }]
});

// virtual attribute birthday to birthday_formatted
userSchema.virtual("birthday_formatted").get(() => {
  return moment(this.birthday).format("YYYY/mm/DD");
});

module.exports = mongoose.model("User", userSchema);
