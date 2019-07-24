const $ = require("jquery");

module.exports.editBtnEvent = () => {
  $(`#edit #editSubmit`).attr("disabled", true);

  let input = {
    fullname: $(`#edit input[name=fullname]`).val(),
    phone: $(`#edit input[name=phone]`).val(),
    birthday: $(`#edit input[name=birthday]`).val(),
    gender: $(`#edit input[name=gender]:checked`).val()
  };

  $.post("/user/edit", input)
    .done(data => {
      let msgTag = $(`#edit #msg`);
      let icon = `<i class="fas fa-lg fa-exclamation-triangle mr-2"/>`;
      let child = `<span>${icon}${data.msg}</span>`;

      if (data.type === 0) {
        msgTag
          .empty()
          .removeClass("alert-success")
          .addClass("alert-danger")
          .append(child);
        $(`#edit #msg`).show();
        $(`#edit form`).addClass("was-validated");
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
