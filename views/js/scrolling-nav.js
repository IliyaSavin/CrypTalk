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

  $.fn.scrollView = function () {
    return this.each(function () {
      console.log($(this).scrollTop());
      $('#message-all').animate({
        scrollTop: $(this).top
      }, 100);
    });
  }

  function scrollToElement(element, parent) {
    $(parent)[0].scrollIntoView(true);
    $(parent).animate({
      scrollTop: $(parent).scrollTop() + $(element).offset().top - $(parent).offset().top
    }, {
      duration: 0
      //easing: 'swing'
    });
  }


  $("#createButton").on('click', function(e) {
    $("#ownerNameModal").modal('show');
  });

  //$("#newOwnerButton").on('click', function(e) {
    
  //})


  $("#newOwnerName").focus(function(e) {
    $("#newOwnerName").popover("hide");
  })

  $("#newOwnerButton").on('click', function(e) {
    if ($("#newOwnerName").val().length > 0) {
      $.ajax({
        type: "POST",
        url: "/createChat",
        data: {name: $("#newOwnerName").val()},
        success: function(result) {
          $("#keyText").val(result);
          $("#ownerNameModal").modal('hide');
          $("#ownerVisitModal").modal('show');
        }
      })
    } else {
      $("#newOwnerName").popover("dispose");
      $("#newOwnerName").popover({
        content: "Введіть ім'я",
        placement: "top",
        trigger: "manual"
      });
      $("#newOwnerName").popover("show");
    }
    
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

  var HtmlValidate = (text) => {
    text = text.replace(/</g, '&lt');
    text = text.replace(/>/g, '&gt');
    return text;
  }

  $("#get-key-admin").click(function(e) {
    $.ajax({
      url: "/remindByName",
      type: "POST",
      data: {
        id: $("#choose-select-admin").val()
      },
      success: function(result) {
        if (result) {
          console.log(result);
          $("#admin-remind-modal").modal("hide");
          $("#user-remind-key").val(result);
          $("#user-remind-modal").modal("show");
        }
      }
    })
    console.log($(this).attr("id"));
  })

  $("#choose-select-admin").on("change", function() {
    $("#choose-select-admin").popover("hide");
  })

  $("#remove-key-confirm").click(function(e) {
    if ($("#choose-select-admin").val() != $("#userId").text()) {
      $("#admin-remind-modal").modal("hide");
      $("#delete-user-confirm-modal").modal("show");
    } else {
      $("#choose-select-admin").popover("dispose");
      $("#choose-select-admin").popover({
        content: "Ви не можете видалити самого себе",
        placement: "top",
        trigger: "manual"
      });
      $("#choose-select-admin").popover("show");
      setTimeout(function() {
        $("#choose-select-admin").popover("hide");
      }, 1200);
    }
    
  })

  $("#remove-key-admin").click(function(e) {
      $.ajax({
        url: "/deleteUser",
        type: "POST",
        data: {
          id: $("#choose-select-admin").val()
        },
        success: function(result) {
          if (result) {
            console.log(result);
            $("#delete-user-confirm-modal").modal("hide");
            $("#delete-user-modal").modal("show");
          }
        }
      })
  })

  $("#user-remind-link").click(function(e) {
    console.log("remind");
    $.ajax({
      url: "/remind",
      type: "POST",
      data: {
        id: $("#userId").text()
      },
      success: function(result) {
        if (result) {
          $("#user-remind-key").val(result);
        }
      }
    })
  })

  $("#inputMain").focus(function(e) {
    $("#inputMain").popover("hide");
  })

  $('#enterButton').on('click', function() {
    let key = HtmlValidate($("#inputMain").val());
    console.log(key.length);
    if (key.length >= 8) {
      $.ajax({
        type: "POST",
        url: "/keyCheck",
        data: {key: HtmlValidate($("#inputMain").val())},
        success: function(result) {
          if(result.pass) {
            $("#enterForm").submit();
          } else {
            $("#inputMain").popover("dispose");
            $("#inputMain").popover({
              content: "Невірний ключ",
              placement: "top",
              trigger: "manual"
            });
            $("#inputMain").popover("show");
          }
        }
      })
    } else {
      $("#inputMain").popover("dispose");
      $("#inputMain").popover({
        content: "Ключ має довжину в 8 символів",
        placement: "top",
        trigger: "manual"
      });
      $("#inputMain").popover("show");
    }
    
  })

  $(document).ready(function() {
    if ($("#userId").text() != "") {
      console.log("get Trigger");
      $.ajax({
        url: "/getTrigger",
        type: "POST",
        data: {
          id: $("#userId").text()
        },
        success: function(message) {
          if (message.id) {
            scrollToElement($("div#" + message.id), $("#message-all"));
          }
        }
      })
    }
    console.log("ready");
  })

  $(".reload-button").click(function(e) {
    location.reload();
  })

  $("#newMemberName").focus(function(e) {
    $("#newMemberName").popover("hide");
  })

  $('#createKeyButton').on('click', function() {
    if ($('#newMemberName').val().length > 0) {
      $.ajax({
        type: "POST",
        url: "/createKey",
        data: {id: $('#userId').text(), name: $('#newMemberName').val()},
        success: function(result) {
          if (result.check) {
            $('#newKeyModal').modal('hide');
            $('#new-member-key').val(result.key);
            $('#getNewKeyModal').modal('show');
            $('#newMemberName').val("");
          }
          else {
            $("#newMemberName").popover("dispose");
              $("#newMemberName").popover({
                content: "Це ім'я вже зайняте",
                placement: "top",
                trigger: "manual"
              });
              $("#newMemberName").popover("show");
          }
        }
      })
    } else {
      $("#newMemberName").popover("dispose");
      $("#newMemberName").popover({
        content: "Введіть ім'я",
        placement: "top",
        trigger: "manual"
      });
      $("#newMemberName").popover("show");
    }
    
  })

  $("#delete-key").focus(function(e) {
    $("#delete-key").popover("hide");
  })

  $('#delete-button').on('click', function() {
    $.ajax({
      type: "POST",
      url: "/isOwner",
      data: {key: $("#delete-key").val()},
      success: function(result) {
        if (result) {
          $.ajax({
            type: "POST",
            url: "/delete",
            data: {id: $('#userId').text()}
          })
        } else {
          $("#delete-key").popover("dispose");
          $("#delete-key").popover({
            content: "Невірний ключ",
            placement: "top",
            trigger: "manual"
          });
          $("#delete-key").popover("show");
        }
      }
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

$('#user-remind-copy-button').click(function() {
  $('#user-remind-key').focus();
  $('#user-remind-key').select();
  document.execCommand('copy');
})


socket.on('connect', function() {
  console.log("connected front-end");

  socket.on('delete', function() {
    console.log("delete front-end");
    window.location.href = "/";
  })

  socket.on('deleteCheck', function(user){
    if (user.id == $("#userId").text()) {
      window.location.href = "/";
    }
  })

  socket.on('last message', function(message) {
    $.ajax({
      url: "/updateTrigger",
      type: "POST",
      data: {
        id: $("#userId").text(),
        message: message.id
      }
    })
  })

  socket.on('get message', function(message) {
    console.log("get message front-end");
    $("#message-all").prepend(`
      <div class="message-bottom p-0 m-0 position-relative">
        <a class="message-body float-left"> ${message.text} </a>
      </div>
      <div class="message-top p-0 m-0 position-relative">
        <a class="message-owner float-left" style="color: ${message.color}">${message.name}</a>
        <div class="message-time float-right "> ${message.time} </div>
      </div>`)
  });
})


$("#inputMain").keypress(function(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    $("#enterButton").trigger('click');
    e.preventDefault();
    return true;
  }
})

$("#messageText").keypress(function(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    $("#send-button").trigger('click');
    e.preventDefault();
    return true;
  }
})

$("#messageText").focus(function(e) {
  $("#messageText").popover("hide");
})

$("#messageText").keyup(function(e) {
  if (e.which != 13){
    $("#messageText").popover("hide");
  }
})

$("#send-button").click(function() {
  let currentMessage = HtmlValidate($('#messageText').val());
  if (currentMessage.length > 0) {
    $('#messageText').val("");
    socket.emit("new message", {
      message: currentMessage,
      id: $("#userId").text(),
      time: new Date()});
  } else if (currentMessage.length > 256) {
    $("#messageText").popover("dispose");
      $("#messageText").popover({
        content: "Максимальна довжина повідомлення - 256 символів",
        placement: "top",
        trigger: "manual"
      });
      $("#messageText").popover("show");
  } else {
    $("#messageText").popover("dispose");
      $("#messageText").popover({
        content: "Введіть текст повідомлення",
        placement: "top",
        trigger: "manual"
      });
      $("#messageText").popover("show");
  }
  
})

})(jQuery); // End of use strict