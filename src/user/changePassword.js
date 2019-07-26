const $ = require("jquery");

var ajaxChangePassword = function() {
  let input = {
    csrfToken: $("#changePasswordForm input[name=csrfToken]").val(),
    currentPassword: $("#changePasswordForm input[name=currentPassword]").val(),
    newPassword: $("#changePasswordForm input[name=newPassword]").val(),
    confirmPassword: $("#changePasswordForm input[name=confirmPassword]").val()
  };
  console.log(input);

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
};

$(document).ready(function() {
  $("#changePasswordBtn").click(function(e) {
    e.preventDefault();

    ajaxChangePassword();
  });
});
