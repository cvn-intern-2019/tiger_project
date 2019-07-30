import "./layout";
import { restProperty } from "babel-types";

const $ = require("jquery");

let searchRoomEvent = function() {
  let keyword = $("#search_input")
    .val()
    .toLowerCase();

  $("#room_area>div")
    .hide()
    .each(function(index, element) {
      let roomName = $(element)
        .find(".room_name_id")
        .text()
        .toLowerCase();

      let roomAuthor = $(element)
        .find(".room_author")
        .text()
        .toLowerCase();

      if (roomName.search(keyword) != -1 || roomAuthor.search(keyword) != -1) {
        $(element).fadeIn(200);
      }
    });
};

$(document).ready(function() {
  $("#search_input").keyup(searchRoomEvent);
});
