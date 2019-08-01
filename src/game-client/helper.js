const $ = require("jquery");
module.exports.countDown = (minutes, seconds) => {
  let clock = $(`#clock .badge`);
  seconds--;
  clock.text(
    `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`
  );
  if (seconds == 0)
    if (minutes > 0) {
      minutes--;
      seconds = 60;
    }
  return { minutes: minutes, seconds: seconds };
};
