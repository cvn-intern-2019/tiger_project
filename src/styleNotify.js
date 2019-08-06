const $ = require("jquery");

$.notify.addStyle("warning", {
  html: `<div>
            <h3><b>Notification</b></h4>
            <hr>
            <div class="h5">
                <i class="fas fa-exclamation-triangle fa-1x"></i>
                <span data-notify-text/>
            </div>
        </div>`,
  classes: {
    base: {
      "border-radius": ".25rem!important",
      "border": "1px solid #dee2e6!important",
      "border-color": "#343a40!important",
      "background-color": "#f8f9fa!important",
      "padding": "1.5rem!important",
      "color": "#343a40!important"
    }
  }
});

$.notify.addStyle("notify", {
  html: `<div>
              <h3><b>Notification</b></h4>
              <hr>
              <div class="h5">
                  <i class="fas fa-hand-point-right fa-1x"></i>
                  <span data-notify-text/>
              </div>
          </div>`,
  classes: {
    base: {
      "border-radius": ".25rem!important",
      "border": "1px solid #dee2e6!important",
      "border-color": "#343a40!important",
      "background-color": "#f8f9fa!important",
      "padding": "1.5rem!important",
      "color": "#343a40!important"
    }
  }
});


$.notify.addStyle("witchSave", {
  html: `<div>
            <div id="saveBox" class="bg-light text-dark p-2 text-center">
              <span data-notify-text="content"/>
              <p>================</p>
              
              <button class="yes btn btn-sm btn-dark">Yes</button>
              <button class="no btn btn-sm btn-secondary">No</button>
            </div>
        </div>`
});

//listen for click events from this style
$(document).on("click", "#saveBox .no", function() {
  $(`#controller #saveResult`).remove();
  $(this).trigger("notify-hide");
});

$(document).on("click", "#saveBox .yes", function() {
  $(`#controller #saveResult`).remove();
  $(`#controller`).append(`<p id="saveResult" class="d-none">true</p>`);

  $(this).trigger("notify-hide");
});
