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
          .removeClass("d-none")
          .addClass("d-block");
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
  $(`#changePassword #changePasswordBtn`).attr("disabled", true);
  let input = {
    csrfToken: $("#changePasswordForm input[name=csrfToken]").val(),
    currentPassword: $("#changePasswordForm input[name=currentPassword]").val(),
    newPassword: $("#changePasswordForm input[name=newPassword]").val(),
    confirmPassword: $("#changePasswordForm input[name=confirmPassword]").val()
  };
  $.post("/user/password/update", input)
    .done(data => {
      let msgTag = $("#changePasswordForm #msg");
      let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;

      let child = `<span>${icon}${data.msg}</span>`;

      $("#changePasswordForm input[name=csrfToken]").val(data.csrfToken);
      if (data.type == 0) {
        msgTag
          .empty()
          .append(child)
          .removeClass("d-none")
          .addClass("d-block");
      }
      if (data.type == 1) {
        window.location.reload();
      }
      $("#changePasswordForm").trigger("reset");
      $(`#changePassword #changePasswordBtn`).attr("disabled", false);
    })
    .fail(() => {
      alert("Error: Something wrong!");
      $(`#changePasswordBtn`).attr("disabled", false);
    });
  $(this).disable = false;
};

module.exports.readURL = function(input) {
  let extension = input.files[0].type;
  if (extension !== "image/png" && extension !== "image/jpeg") {
    alert("File is invalid!");
    return;
  }
  if (input.files[0].size > 800000) {
    alert("Size of file can't over 800KB");
    return;
  }
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $(`#changeAvatarModal img`).attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    $(`#changeAvatarModal img`).attr("src", "http://placehold.it/250");
  }
};
