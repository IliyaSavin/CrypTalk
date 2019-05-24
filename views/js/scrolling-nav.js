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
    if ($('#userId').text() != ""){
      //console.log($('#userId').text());
      socket.emit("enter chat", $('#userId').text());
    }
  }

  document.addEventListener("DOMContentLoaded", chatConnect);

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

  /*function copyToClipBoard(txt) {
    try {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(txt).select();
        console.log($temp.val());
        var retVal = document.execCommand("copy");
        console.log('Copy to clipboard returns: ' + retVal);
        $temp.remove();
    } catch (err) {
        console.log('Error while copying to clipboard: ' + err);
    }
}*/

function copyToClipBoard(element) {
  let $temp = $("<input>");
  $("body").append($temp);
  console.log($(element).val());
  $temp.val($(element).val()).select();
  document.execCommand("copy");
  $temp.remove();
}

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