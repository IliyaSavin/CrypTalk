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


  $("#createButton").on('click', function(e) {
    $("#ownerNameModal").modal('show');
  });

  //$("#newOwnerButton").on('click', function(e) {
    
  //})

  $("#newOwnerButton").on('click', function(e) {
    $.ajax({
      type: "POST",
      url: "/createChat",
      data: {name: $("#newOwnerName").val()},
      success: function(result) {
        if (result != null) {
          $("#keyText").val(result);
          $("#ownerNameModal").modal('hide');
          $("#ownerVisitModal").modal('show');
        }
      }
    })
  })

  var socket = io();
  var chatConnect = function() {
    console.log("chatConnect");
    if ($('#userId').text() != ""){
      $.ajax({
        type: "POST",
        url: "/logIn",
        data: {id: $('#userId').text()},
        success: function(result) {
          if(result) {
            socket.emit("enter chat", result);
          }
        }
      })
    }
  }

  document.addEventListener("DOMContentLoaded", chatConnect);

  $('#enterButton').on('click', function() {
    $.ajax({
      type: "POST",
      url: "/keyCheck",
      data: {key: $("#inputMain").val()},
      success: function(result) {
        if(result) {
          $("#enterForm").submit();
        }
      }
    })
  })

  $('#createKeyButton').on('click', function() {
    $.ajax({
      type: "POST",
      url: "/createKey",
      data: {id: $('#userId').text(), name: $('#newMemberName').val()},
      success: function(result) {
        $('#newKeyModal').modal('hide');
        $('#new-member-key').val(result);
        $('#getNewKeyModal').modal('show');
      }
    })
  })

  $('#delete-button').on('click', function() {
    $.ajax({
      type: "POST",
      url: "/delete",
      data: {id: $('#userId').text()}
    })
  })

$('#copy-button-new').on('click', function(e) {
  $('#new-member-key').focus();
  $('#new-member-key').select();
  document.execCommand('copy');
})

$('#copy-button-owner').click(function() {
  $('#keyText').focus();
  $('#keyText').select();
  document.execCommand('copy');
});


socket.on('connect', function() {
  console.log("connected front-end");

  socket.on('delete', function() {
    console.log("delete front-end");
    window.location.href = "/";
  })

  socket.on('get message', function(message) {
    console.log("get message front-end");
    $("#message-all").prepend(`
      <div class="message-bottom p-0 m-0 position-relative">
        <a class="message-body float-left"> ${message.text} </a>
      </div>
      <div class="message-top p-0 m-0 position-relative">
        <a class="message-owner float-left">${message.name}</a>
        <div class="message-time float-right "> ${message.time} </div>
      </div>`)
  });
})
  $("#send-button").click(function() {
    socket.emit("new message", {
      message: $('#messageText').val(), 
      id: $("#userId").text(),
      time: new Date()});
      $('#messageText').val("");
  })

})(jQuery); // End of use strict