import "bootstrap/dist/css/bootstrap.min.css";
import "../user/animate.css";
const $ = require("jquery");

$(document).ready(() => {
  $(`#loginMsg`).hide();

  var loginBtnEvent = () => {
    $(`#loginSubmit`).attr("disabled", true);

    let input = {
      username: $(`#loginForm input[name=username]`).val(),
      password: $(`#loginForm input[name=password]`).val(),
      csrfToken: $(`#loginForm input[name=csrfToken]`).val()
    };

    $.post("/login", input)
      .done(data => {
        let msgTag = $(`#loginForm #loginMsg`);
        let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;
        let child = `<span>${icon}${data.msg}</span>`;

        if (data.type === 0) {
          msgTag
            .empty()
            .removeClass("alert-success")
            .addClass("alert-danger")
            .append(child);
        }

        if (data.type === 1) {
          window.location.replace(`${window.origin}/lounge`);
        }
        $(`#loginForm input[name=csrfToken`).val(data.csrfToken);
        $(`#loginForm input[name=csrfToken`).val(data.csrfToken);
        $(`#loginForm #loginMsg`).show();
        $(`#loginSubmit`).attr("disabled", false);
      })
      .fail(err => {
        alert("Something wrong!");
        $(`#loginSubmit`).attr("disabled", false);
      });
  };

  $(`#loginSubmit`).mousedown(event => {
    if (event.which == 1) {
      loginBtnEvent();
    }
  });

  $(`#loginForm input`).keypress(event => {
    if (event.which == 13) {
      loginBtnEvent();
    }
  });
});
