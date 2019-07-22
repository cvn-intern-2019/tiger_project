const $ = require('jquery');
var checkMatch = function (password,retypePassword) {
    if (password==retypePassword) return true; else return false
}
$(document).ready(
    function(){
        $("input[name=password],input[name=retypePassword]").change(function(){
            var password = $("input[name=password]").val();
            var retypePassword = $("input[name=retypePassword]").val();

            if(checkMatch(password,retypePassword)==true){
                $(".error_panel").append(
                    "<li>Password & Retype Password mismatch.</li>"
                )
            }
        })
    }
);