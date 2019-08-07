import "../layout";
import "datatables.net/js/jquery.dataTables";

const $ = require("jquery");
const editProfile = require("./profile.edit");

$(document).ready(() => {
  $("#history table").DataTable({
    scrollY: "40vh",
    scrollCollapse: true,
    order: [[0, "desc"]],
    paging: false
  });
  $("#createRoom").hide();
  $(".search-box").hide();

  if (
    $(`#changeAvatarModal img`)
      .attr("src")
      .includes("placehold.it")
  )
    $(`#changeAvatarModal #deleteAvatar`).hide();
  else $(`#changeAvatarModal #deleteAvatar`).show();

  $(`#edit #editSubmit`).mousedown(event => {
    if (event.which == 1) {
      editProfile.editBtnEvent();
    }
  });

  $("#changePasswordBtn").click(event => {
    if (event.which == 1) {
      editProfile.changePasswordEvent();
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

  var urlClone = null;
  $(`#changeAvatarModal input[name=avatarFile]`).change(function(e) {
    if ($(e.target).val() == "") {
      $(e.target).replaceWith(urlClone);
      return;
    }
    urlClone = $(e.target).clone();
    editProfile.readURL(this);
    $(`#changeAvatarModal #submitChange`).attr("disabled", false);
    if ($(this).val() == "") $(`#changeAvatarModal #deleteAvatar`).hide();
    else $(`#changeAvatarModal #deleteAvatar`).show();
  });

  $(`#changeAvatarModal #deleteAvatar`).mousedown(event => {
    if (event.which == 1) {
      $(`#changeAvatarModal input[name=avatarFile]`).val("");
      $(`#changeAvatarModal img`).attr("src", "http://placehold.it/250");
      $(`#changeAvatarModal #submitChange`).attr("disabled", false);
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
