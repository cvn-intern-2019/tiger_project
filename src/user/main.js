import "bootstrap/dist/css/bootstrap.min.css";
import "../user/animate.css";
const $ = require("jquery");
const login = require("./login");

$(document).ready(() => {
  $(`#loginSubmit`).mousedown(event => {
    if (event.which == 1) {
      login.loginBtnEvent();
    }
  });

  $(`#loginForm input`).keypress(event => {
    if (event.which == 13) {
      login.loginBtnEvent();
    }
  });

  $(`#goRegister`).mousedown(event => {
    if (event.which == 1) {
    }
  });
});
