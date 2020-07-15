$(document).ready(function () {
    var telephone = false;
    var telephone_number = false;
    var activeButton = false;

    let phoneStats1 = {
      page: 0,
    };

    window.telephone = {
      enable: (status) => {
        if(status) {
          $(document).keydown(function (e) {
            if (window.medicTablet.active() || window.pdTablet.active() || window.armyTablet.active() || selectMenuAPI.active() || window.sheriffTablet.active() || window.fibTablet.active() || window.playerMenu.active() || chatAPI.active() || consoleAPI.active() || tradeAPI.active() || modalAPI.active()) return;
            if (event.which === 9) {
              return false;
            } else if (e.which === 38) { // arrow UP
                if (!telephone_number) return mp.trigger(`nError`, `Phone number not loaded!`);
                $("#uPhoneS").removeClass("Animate");
                $("#uPhoneS").css("display", "block");
                telephone = true;
                mp.trigger("telephone.active", true);
            } else if (e.which === 40) { // arrow Down
                $("#uPhoneS").addClass("Animate");
                telephone = false;
                mp.trigger("telephone.active", false);
            }

            if(telephone) {
              if(e.which === 39) { // arrow Right
                phoneStats1.page += 1;
                if(phoneStats1.page === 3 || phoneStats1.page === -3) phoneStats1.page = 0;
                moveRight();
              } else if(e.which === 37) { // arrow Left
                phoneStats1.page -= 1;
                if(phoneStats1.page === 3 || phoneStats1.page === -3) phoneStats1.page = 0;
                moveLeft();
              } else if(e.which === 13) {
                if(activeButton === false) {
                  if (phoneStats1.page === 1 || phoneStats1.page === -2) {
                    activeButton = true;
                    $(".contactsList").show();
                    $("#slider").hide();
                    $(".settings").show();
                    $(".messagesList").hide();
                  } else if(phoneStats1.page === 2 || phoneStats1.page === -1) {
                    activeButton = true;
                    $(".toolsList").show();
                    $("#slider").hide();
                    $(".settings").show();
                  } else if(phoneStats1.page === 0) {
                    activeButton = true;
                    $(".messagesList").show();
                    $("#slider").hide();
                    $(".settings").show();
                  }
                }
              }
            }
          });
        }
      },
      active: () => {
        return telephone;
      },
      setnum: (num) => {
        telephone_number = num;
      }
  }

   $("#buttonAccept").focus(() => {
      $(".greenPhone").css("text-shadow","0px 0px 1px black").css("font-size","2em");
    }).focusout(() => {
      $(".greenPhone").css("text-shadow","0px 0px 1px black").css("font-size","2.1em");
    });

    $("#buttonUnaccept").focus(() => {
      $(".redPhone").css("text-shadow","0px 0px 1px black").css("font-size","2em");
    }).focusout(() => {
      $(".redPhone").css("text-shadow","0px 0px 1px black").css("font-size","2.1em");
    });

    $(".contactsList").hide();
    $(".messagesList").hide();
    $(".toolsList").hide();
    $(".settings").hide();
    $(".options").hide();
    $(".message").hide();
    $(".settingsTools").hide();
    $(".themeList").hide();
    $(".incomingList").hide();
    $(".outgoingList").hide();
    $(".settingsOutgoing").hide();
    $(".settingsAction").hide();
    $(".addContact").hide();
    $(".outgoingMessageList").hide();
    $(".incomingMessageList").hide();
    $(".settingsExitFromMessage").hide();
    $(".settingsExitFromMessageOutgoing").hide();

    $(".incomingMessage").click(() => {
      $(".incomingMessageList").show();
      $(".incomingList").hide();
      $(".settingsOutgoing").hide();
      $(".messageBy").show();
      $(".settingsExitFromMessage").show();
    });

    $("#backExitFromMessageOutgoing").click(() => {
      $(".outgoingMessageList").hide();
      $(".outgoingList").show();
      $(".settingsOutgoing").show();
      $(".messageBy").hide();
      $(".settingsExitFromMessageOutgoing").hide();
    });

    $("#backExitFromMessage").click(() =>{
      $(".incomingMessageList").hide();
      $(".incomingList").show();
      $(".settingsOutgoing").show();
      $(".messageBy").hide();
      $(".settingsExitFromMessage").hide();
    });

    $("#backOutgoing").click(() =>{
      $(".messagesList").show();
      $(".outgoingList").hide();
      $(".settingsOutgoing").hide();
      $(".settings").show();
      $(".incomingList").hide();
    });
    $("#outgoing").click(() => {
      $(".outgoingList").show();
      $(".settingsOutgoing").show();
      $(".settings").hide();
      $(".messagesList").hide();
    });

    $("#incoming").click(() => {
      $(".incomingList").show();
      $(".settingsOutgoing").show();
      $(".settings").hide();
      $(".messagesList").hide();
    });

    $('#contacts').click(() => {
        $(".contactsList").show();
        $("#slider").hide();
        $(".settings").show();
        $(".messagesList").hide();
    });
    $('.contact').click(() => {
        $(".contactsList").hide();
        $(".options").show();
        $(".settings").hide();
        $(".settingsAction").show();
        $(".messagesList").hide();
    });
    $(".outgoingMessage").click(() =>{
      $(".outgoingMessageList").show();
      $(".outgoingList").hide();
      $(".settingsOutgoing").hide();
      $(".messageBy").show();
      $(".settingsExitFromMessageOutgoing").show();
    });
    $('#contacted').click(() => {
        $(".contactsList").hide();
        $(".options").show();
        $(".settings").hide();
        $(".settingsAction").show();
        $(".messagesList").hide();
    });
    $('#backAction').click(() => {
      $(".contactsList").show();
      $(".options").hide();
      $(".settings").show();
      $(".settingsAction").hide();
    });
    $('#backMessage').click(() => {
        $(".options").show();
        $(".message").hide();
        $(".settingsAction").show();
        $(".messagesList").hide();
    });
    $('#backChangeContact').click(() =>{
      $(".changeContact").hide();
      $(".changeContactSettings").hide();
      $(".options").show();
      $(".settingsAction").show();
    });
    $('#pathToSendMessage').click(() => {
        $(".contactsList").hide();
        $(".options").hide();
        $(".message").show();

        $(".settingsAction").hide();
        $(".messagesList").hide();
        $("textarea").val("");

    });
    $(".changeContact").hide();
    $(".changeContactSettings").hide();
    $("#pathToChange").click(() => {
        $(".contactsList").hide();
        $(".changeContact").show();
        $("#changeNameOfContact").val("");
        $("#changeNumberOfContact").val("");
        $(".options").hide();
        $(".message").hide();

        $(".settingsAction").hide();
        $(".messagesList").hide();
        $(".changeContactSettings").show();
        $("textarea").val("");
    });

    $("#ThemeTwo").click(() => {
      localStorage["Theme"] = "Pink";
      var bg = document.getElementById("uPhoneS");
      bg.style.backgroundImage = "url(./img/telephone/bgPink.png)";
      document.getElementById("imgIconBook").src="./img/telephone/iconBookPink.png";
      document.getElementById("imgIconMessage").src="./img/telephone/iconMessagePink.png";
      document.getElementById("messages").src="./img/telephone/messagesPink.png";
      document.getElementById("contacts").src="./img/telephone/contactsPink.png";
      document.getElementById("tools").src="./img/telephone/toolsPink.png";
      document.getElementById("arrowOne").src="./img/telephone/arrowPink.svg";
      document.getElementById("arrowTwo").src="./img/telephone/arrowPink.svg";
      var numerals = document.getElementsByClassName("buttonNumeral");
      for(let i = 0; i < numerals.length; i++){
        numerals[i].style.color = "#9a8698";
      }
    });
    $("#ThemeOne").click(() => {
      localStorage["Theme"] = "Blue";
      var bg = document.getElementById("uPhoneS");
      bg.style.backgroundImage = "url(./img/telephone/bgBlue.png)";
      document.getElementById("imgIconBook").src="./img/telephone/iconBook.png";
      document.getElementById("imgIconMessage").src="./img/telephone/iconMessage.png";
      document.getElementById("messages").src="./img/telephone/messages.png";
      document.getElementById("contacts").src="./img/telephone/contacts.png";
      document.getElementById("tools").src="./img/telephone/tools.png";
      document.getElementById("arrowOne").src="./img/telephone/arrow.svg";
      document.getElementById("arrowTwo").src="./img/telephone/arrow.svg";
      var numerals = document.getElementsByClassName("buttonNumeral");
      for(let i = 0; i < numerals.length; i++){
        numerals[i].style.color = "#7e939b";
      }
    });

    $("#pathToTheme").click(() => {
        $(".settingsTools").show();
        $(".themeList").show();
        $(".toolsList").hide();
        $(".settings").hide();
    });
    $("#backTools").click(() => {
      $(".settingsTools").hide();
      $(".themeList").hide();
      $(".toolsList").show();
      $(".settings").show();
    });

    $('#backList').click(() =>{
      $(".contactsList").hide();
      $(".settings").hide();
      $(".options").hide();
      $(".message").hide();
      $(".messagesList").hide();
      $(".toolsList").hide();
      $('#slider').show();
      activeButton = false;
      // $(".contact").remove();
      // $(".contactsList").append('<div class="contact" id="addContact"><div class="user">+ Добавить контакт</div></div>');
    });
    $('#messages').click(() =>{
      $(".messagesList").show();
      $("#slider").hide();
      $(".settings").show();
    });

    $('#tools').click(() => {
      $(".toolsList").show();
      $("#slider").hide();
      $(".settings").show();
    });
    var lastFocused;
    $('textarea').click(() => {
      lastFocused = $(document.activeElement)[0];
    });
    $('input').click(() => {
      lastFocused = $(document.activeElement)[0];
    });


    $(".addContactSettings").hide();
    $("#addContact").click(() => {
      $(".addContact").show();
      $(".settingsAction").hide();
      $(".addContactSettings").show();
      $(".options").hide();
      $("#nameOfContact").val("");
      $("#numberOfContact").val("");
    });
    $("#backAddContact").click(() =>{
      $(".contactsList").show();
      $(".addContact").hide();
      $(".addContactSettings").hide();
      $(".settings").show();
    });
    $()
    var time =`${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'')+new Date().getMinutes()}`;
    $('body #uPhoneS.uPhoneS .screen .header .time').text(time);

    setInterval(() => {
        var time =`${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'')+new Date().getMinutes()}`;
        $('body #uPhoneS.uPhoneS .screen .header .time').text(time);
    }, 1000);

    var weekday = new Array(7);
    weekday[0] = "Вс";
    weekday[1] = "Пн";
    weekday[2] = "Вт";
    weekday[3] = "Ср";
    weekday[4] = "Чт";
    weekday[5] = "Пт";
    weekday[6] = "Сб";

    var d = new Date();
    var n = weekday[d.getDay()];
    $('body #uPhoneS.uPhoneS .screen .header .day').text(' ' + n);

    var slideCount = $('#slider ul li').length;
    var slideWidth = $('#slider ul li').width();
    var slideHeight = $('#slider ul li').height();
    var sliderUlWidth = slideCount * slideWidth;

    $('#slider').css({
        width: slideWidth,
        height: slideHeight
    });


    $('#slider ul').css({
        width: sliderUlWidth,
        marginLeft: -slideWidth
    });

    $('#slider ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
        $('#slider ul').animate({
            left: +slideWidth
        }, 250, function () {
            $('#slider ul li:last-child').prependTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    function moveRight() {
        $('#slider ul').animate({
            left: -slideWidth
        }, 250, function () {
            $('#slider ul li:first-child').appendTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });

    $("form").submit((eve) => {
      eve.preventDefault();
    });

    $('.fa-times').click(() => {
      $('.error').css("display","none");
    });

    $('#toCall').click(() => {
      mp.trigger('telephone.call', $('#reciepent').val());
      $("#slider").show();
      $(".settingsAction").hide();
      $(".addContactSettings").hide();
      $(".options").hide();
    });

    $('#selectMessage').click(() => {
      if($('#textMessage').val() == ''){
        $('.error').slideDown("slow").delay(1000).slideUp("slow");
        $('.error span').html("Mistake #1: some input fields are not filled");
      }

      else{
        $(".message").hide();
        $(".contactsList").show();
        $(".settings").show();
        $(".messagesList").hide();
        mp.trigger('sendMessage', $('#pass_id').val(), $('#textMessage').val());
      }
    });
    $('#incomingButton').click(() => {
      mp.trigger('selectIncomingMessages');
    });
    $('#outgoingButton').click(() => {
      mp.trigger('selectOutgoingMessages');
    });
    $('#contacts').click(() => {
      mp.trigger('dataContacts');
    });
    $('#readyAddContact').click(() => {
        mp.trigger('select.add.contact',  $('#nameOfContact').val(), $('#numberOfContact').val());
        $("#slider").show();
        $(".addContact").hide();
        $(".settingsAction").hide();
        $(".addContactSettings").hide();
        $(".options").hide();
        // $(".contact").remove();
    });

    $('#readyChangeContact').click(() => {
        mp.trigger('selectChangeContact', $('#pass_id').val(), $('#changeNameOfContact').val(), $('#changeNumberOfContact').val());
        $(".changeContact").hide();
        $(".changeContactSettings").hide();
        $("#slider").show();
    });

    $('#pathToDelete').click(() => {
      mp.trigger('deleteContact', $('#pass_id').val());
      $("#slider").show();
      $(`#BС${$('#pass_id').val()}`).remove();
      $(".settingsAction").hide();
      $(".addContactSettings").hide();
      $(".options").hide();
    });


    $('#buttonAccept').click(() => {
      // write here code
    })
});
