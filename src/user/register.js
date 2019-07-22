const $ = require("jquery");

module.exports.hideForm = () => {
  $(`#registerForm`).hide();
};

module.exports.showForm = () => {
  $(`#registerForm #msg`).hide();
  $(`#registerForm`).show();
};

module.exports.registerBtnEvent = () => {
  $(`#registerSubmit`).attr("disabled", true);
  let input = {
    username: $(`#registerForm input[name=username]`).val(),
    password: $(`#registerForm input[name=password]`).val(),
    confirmPassword: $(`#registerForm input[name=confirmPassword]`).val(),
    csrfToken: $(`#registerForm input[name=csrfToken]`).val()
  };
  $.post("/register", input)
    .done(data => {
      let msgTag = $(`#registerForm #msg`);
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
        msgTag
          .empty()
          .removeClass("alert-danger")
          .addClass("alert-success")
          .append(child);
      }
      $(`#registerForm input[name=csrfToken`).val(data.csrfToken);
      $(`#registerForm #msg`).show();
      $(`#registerSubmit`).attr("disabled", false);
    })
    .fail(err => {
      alert("Error: Something wrong!");
      $(`#registerSubmit`).attr("disabled", false);
    });
};
