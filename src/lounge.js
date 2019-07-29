import "./layout";
const $ = require("jquery");

$(document).ready(() => {
  const option = {
    // reconnection: false
  };
  var socket = io("/lounge", option);
});
