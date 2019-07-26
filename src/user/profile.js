import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery.slim";
import "../user/animate.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
const $ = require("jquery");
const editProfile = require("./profile.edit");

$(document).ready(() => {
  if (
    $(`#changeAvatarModal img`)
      .attr("src")
      .includes("placehold.it")
  )
    $(`#changeAvatarModal #deleteAvatar`).hide();
  else $(`#changeAvatarModal #deleteAvatar`).show();

  $(`#edit #msg`).hide();

  $(`#edit #editSubmit`).mousedown(event => {
    if (event.which == 1) {
      editProfile.editBtnEvent();
    }
  });

  $(`#changeAvatar`).mouseover(() => {
    $(`#changeAvatar .container`).addClass("bg-dark");
    $(`#changeAvatar`).css("cursor", "pointer");
  });

  $(`#changeAvatar`).mouseleave(() => {
    $(`#changeAvatar .container`).removeClass("bg-dark");
  });

  $(`#changeAvatar`).mousedown(event => {
    if (event.which == 1) {
      if (event.target.className.includes("container")) {
        $(`#changeAvatarModal`).modal("show");
        $(`#changeAvatarModal #submitChange`).attr("disabled", true);
      } else {
        $(`#showAvatarModal`).modal("show");
      }
    }
  });

  var readURL = function(input) {
    if (input.files.length > 0) {
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
      }
    } else {
      $(`#changeAvatarModal img`).attr("src", "http://placehold.it/300");
    }
  };

  $(`#changeAvatarModal input[name=avatarFile]`).change(function() {
    readURL(this);
    $(`#changeAvatarModal #submitChange`).attr("disabled", false);
    if ($(this).val() == "") $(`#changeAvatarModal #deleteAvatar`).hide();
    else $(`#changeAvatarModal #deleteAvatar`).show();
  });

  $(`#changeAvatarModal #deleteAvatar`).mousedown(event => {
    if (event.which == 1) {
      $(`#changeAvatarModal input[name=avatarFile]`)
        .val("")
        .trigger("change");
    }
  });

  $("#changeAvatarModal").on("hidden.bs.modal", function() {
    $(`#changeAvatarModal img`).attr(
      "src",
      $(`#showAvatarModal img`).attr("src")
    );
    $(`#changeAvatarModal input`).val("");
  });
});
