const $ = require("jquery");

module.exports.editBtnEvent = () => {
  $(`#edit #editSubmit`).attr("disabled", true);

  let input = {
    fullname: $(`#edit input[name=fullname]`).val(),
    phone: $(`#edit input[name=phone]`).val(),
    birthday: $(`#edit input[name=birthday]`).val(),
    gender: $(`#edit input[name=gender]:checked`).val(),
    csrfToken: $(`#edit input[name=csrfToken]`).val()
  };

  $.post("/user/edit", input)
    .done(data => {
      let msgTag = $(`#edit #msg`);
      let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;
      let child = `<span>${icon}${data.msg}</span>`;

      if (data.type === 0) {
        msgTag
          .empty()
          .append(child)
          .show();
        $(`#edit input[name=csrfToken]`).val(data.csrfToken);
      }

      if (data.type === 1) {
        window.location.reload();
      }
      $(`#edit #editSubmit`).attr("disabled", false);
    })
    .fail(() => {
      alert("Error: Something wrong!");
      $(`#edit #editSubmit`).attr("disabled", false);
    });
};

module.exports.changePasswordEvent = function() {
  let input = {
    csrfToken: $("#changePasswordForm input[name=csrfToken]").val(),
    currentPassword: $("#changePasswordForm input[name=currentPassword]").val(),
    newPassword: $("#changePasswordForm input[name=newPassword]").val(),
    confirmPassword: $("#changePasswordForm input[name=confirmPassword]").val()
  };
  $.post("/user/password/update", input)
    .done(data => {
      let msgTag = $("#changePasswordForm #msg");
      msgTag.removeClass("d-none").addClass("d-block");
      let child = "<span>" + data.msg + "</span>";
      $("#changePasswordForm input[name=csrfToken]").val(data.csrfToken);
      if (data.type == 0) {
        msgTag
          .empty()
          .removeClass("alert-success")
          .addClass("alert-danger")
          .append(child);
      }
      if (data.type == 1) {
        msgTag
          .empty()
          .removeClass("alert-danger")
          .addClass("alert-success")
          .append(child);
      }
      $("#changePasswordForm").trigger("reset");
    })
    .fail(() => {
      alert("Error: Something wrong!");
      $(`#changePasswordBtn`).attr("disabled", false);
    });
  $(this).disable = false;
};
