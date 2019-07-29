const $ = require("jquery");

$(document).ready(() => {
  const option = {
    // reconnection: false
  };
  var socket = io("/room", option);
  socket.on('chat-message', data =>{
    console.log(data);
  });

  socket.on('thread', function(data){
    $('#thread').append('<p>'+'ducduy say: '+data+'</p>');
  });

  $('form').submit(function(){
    var message = $('#message').val();
    socket.emit('messages', message);
    this.reset();
    return false;
  });
  $("#createRoom").hide();
  $(".search-box").hide();

  // $("#addMessage").click(function(){

  //   var $newElement = $("<p></p>"),
  //   newMessage = $("#messageText").val();
  //   $newElement.append(newMessage);
  //   $newElement.addClass("float-right");
  //   $("#messageBox").append($newElement);
  // });
});


