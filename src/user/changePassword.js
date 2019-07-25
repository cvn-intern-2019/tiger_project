const $ = require("jQuery");

$("#changePasswordBtn").mousedown(function(e) {
  if (event.which == 1) {
    changePasswordEvent();
  }
});

function changePasswordEvent() {
  console.log("ok");

  let input = {
    currentPassword: $(`#changePasswordForm input[name=currentPassword]`).val(),
    password: $(`#changePasswordForm input[name=newPassword]`).val(),
    comfirmPassword: $(`#changePasswordForm input[name=newPassword]`).val()
  };

  $.post("/user/password/update", input).done(data => {
    let msgTag = $("#changePasswordForm #msg");
    let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;
    let child = `<span>${icon}${data.msg}</span>`;

    if (data.type == 0) {
      msgTag
        .empty()
        .removeClass("alert-success")
        .append(child);
      $("#changePasswordForm #msg").show();
    }
    if (data.type == 1) {
      msgTag
        .empty()
        .removeClass("alert-success")
        .addClass("alert-success")
        .append(child);
      $("#changePasswordForm #msg").show();
    }
  });
}
