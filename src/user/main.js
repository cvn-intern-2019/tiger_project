import "bootstrap/dist/css/bootstrap.min.css";
import "../user/animate.css";
const $ = require("jquery");
const login = require("./login");
const register = require("./register");

$(document).ready(() => {
  register.hideForm();
  login.showForm();

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

  $(`#registerSubmit`).mousedown(event => {
    if (event.which == 1) {
      register.registerBtnEvent();
    }
  });

  $(`#registerForm input`).keypress(event => {
    if (event.which == 13) {
      register.registerBtnEvent();
    }
  });

  $(`#goRegister`).mousedown(event => {
    if (event.which == 1) {
      login.hideForm();
      register.showForm();
    }
  });

  $(`#goLogin`).mousedown(event => {
    if (event.which == 1) {
      register.hideForm();
      login.showForm();
    }
  });
});
