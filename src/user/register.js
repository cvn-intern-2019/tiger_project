const $ = require("jquery");

module.exports.hideForm = () => {
  $(`#registerForm`).hide();
};

module.exports.showForm = () => {
  $(`#registerForm input[name=username]`).val("");
  $(`#registerForm input[name=email]`).val("");
  $(`#registerForm input[name=password]`).val("");
  $(`#registerForm input[name=confirmPassword]`).val("");
  $(`#registerForm #msg`).hide();
  $(`#registerForm`).show();
};

module.exports.registerBtnEvent = () => {
  $(`#registerSubmit`).attr("disabled", true);

  let input = {
    username: $(`#registerForm input[name=username]`).val(),
    email: $(`#registerForm input[name=email]`).val(),
    password: $(`#registerForm input[name=password]`).val(),
    confirmPassword: $(`#registerForm input[name=confirmPassword]`).val(),
    captcha: $("input[name='captcha_token").val()
  };

  console.log(input);

  $.post("/register", input)
    .done(data => {
      let msgTag = $(`#registerForm #msg`);
      let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;
      let child = `<span>${icon}${data.msg}</span>`;
      if (data.type === 0) {
        msgTag
          .empty()
          .append(child)
          .show();
      } else if (data.type === 1) {
        window.location.reload();
      }
      $(`#registerSubmit`).attr("disabled", false);
    })
    .fail(err => {
      alert("Error: Something wrong!");
      $(`#registerSubmit`).attr("disabled", false);
      $(`#registerForm input[name=password]`).val("");
      $(`#registerForm input[name=confirmPassword]`).val("");
    });
};
