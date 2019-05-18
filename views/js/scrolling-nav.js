(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 0) // - 56
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

  $(document).ready(function(){
    $("#ownerVisitModal").modal('show');
  });

  /*$('#createButton').click(function(e) {
    console.log(1);
    e.preventDefault();
    $("#ownerVisitModal").modal('show');
  })*/

  function copyToClipBoard(txt) {
    try {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(txt).select();
        var retVal = document.execCommand("copy");
        console.log('Copy to clipboard returns: ' + retVal);
        $temp.remove();
    } catch (err) {
        console.log('Error while copying to clipboard: ' + err);
    }
}

$('#copy-button').on('click', function (e) {
    copyToClipBoard($('#keyText').val());
});

  /*$(() => {
    $("#send-button").click(()=>{
      sendMessage({
        name: $("#name").val(), 
        message:$("#messageText").val(),
        time: new Date()});
      })
      getMessages();
  })

  function addMessages(message){
   $("#message-all").append(`
      <div class="message-bottom p-0 m-0 position-relative">
        <a class="message-body float-left"> ${message.message} </a>
      </div>
      <div class="message-top p-0 m-0 position-relative">
        <a class="message-owner float-left">${message.name}</a>
        <div class="message-time float-right "> ${message.time} </div>
       </div>`)
   }

  function getMessages(){
    $.get("http://localhost:3000/messages", (data) => {
      data.forEach(addMessages);
    })
  }

  function sendMessage(message){
   $.post("http://localhost:3000/messages", message)
  }

  var socket = io();
  socket.on("message", addMessages)*/

  $(function () {
    var socket = io();
    $('message-send-form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#messageText').val());
      $('#messageText').val('');
      return false;
    });
    socket.on('chat message', function(message){
      $("#message-all").append(`
      <div class="message-bottom p-0 m-0 position-relative">
        <a class="message-body float-left"> ${message.message} </a>
      </div>
      <div class="message-top p-0 m-0 position-relative">
        <a class="message-owner float-left">${message.name}</a>
        <div class="message-time float-right "> ${message.time} </div>
       </div>`)
    });
  });

  var socket = io();
  $("#send-button").click(function() {
    socket.emit("new message", {
      message: $('#messageText').val(), 
      key: $("#key").val(),
      time: new Date()});
  })



})(jQuery); // End of use strict