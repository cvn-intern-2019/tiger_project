const $ = require("jquery");

$.getScript(
  "https://www.google.com/recaptcha/api.js?render=6LdkO7EUAAAAAI8AirRFTzPYbW09zmELjJmf6wjd"
).done(() => {
  grecaptcha.ready(function() {
    grecaptcha
      .execute("6LdkO7EUAAAAAI8AirRFTzPYbW09zmELjJmf6wjd", {
        action: "homepage"
      })
      .then(token => {
        $("input[name=captcha_token]").val(token);
      });
  });
});

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

      grecaptcha
        .execute("6LdkO7EUAAAAAI8AirRFTzPYbW09zmELjJmf6wjd", {
          action: "homepage"
        })
        .then(token => {
          $("input[name=captcha_token]").val(token);
        });
    })
    .fail(err => {
      alert("Error: Something wrong!");
      $(`#registerSubmit`).attr("disabled", false);
      $(`#registerForm input[name=password]`).val("");
      $(`#registerForm input[name=confirmPassword]`).val("");
    });
};
