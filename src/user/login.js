const $ = require("jquery");

module.exports.hideForm = () => {
  $(`#loginForm`).hide();
};

module.exports.showForm = () => {
  $(`#loginForm #msg`).hide();
  $(`#loginForm`).show();
};

module.exports.loginBtnEvent = () => {
  $(`#loginSubmit`).attr("disabled", true);

  let input = {
    username: $(`#loginForm input[name=username]`).val(),
    password: $(`#loginForm input[name=password]`).val(),
    csrfToken: $(`#loginForm input[name=csrfToken]`).val()
  };

  $.post("/login", input)
    .done(data => {
      let msgTag = $(`#loginForm #msg`);
      let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;
      let child = `<span>${icon}${data.msg}</span>`;

      if (data.type === 0) {
        msgTag
          .empty()
          .removeClass("alert-success")
          .addClass("alert-danger")
          .append(child);
        $(`#loginForm #msg`).show();
      }

      if (data.type === 1) {
        window.location.replace(`${window.origin}/lounge`);
      }
      $(`#loginForm input[name=csrfToken`).val(data.csrfToken);
      $(`#loginForm input[name=csrfToken`).val(data.csrfToken);
      $(`#loginSubmit`).attr("disabled", false);
    })
    .fail(() => {
      alert("Error: Something wrong!");
      $(`#loginSubmit`).attr("disabled", false);
    });
};
