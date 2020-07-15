exports = (menu) => {
    let our_number;
    mp.events.add('update.player.telephone', (num) => {
      if (!num) return;
      our_number = num;
      menu.execute(`telephone.setnum('${num}');`)
    })

    mp.events.add('update.telephone.messages', (result) => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].sender_num == our_number) outComingMessage(result[i].id, result[i].creator_num, result[i].text);
          else inComingMessage(result[i].id, result[i].sender_num, result[i].text);
        }
    })

    function outComingMessage(id, num, text) {
      menu.execute(`$('.outgoingList').append('<div class="buttonInContent outgoingMessage" id="O${id}"><div class="textButtonInContent">${num}</div></div>')`)
      menu.execute(`$('.outgoingMessageList').attr('id',O2${id})`)
      menu.execute(`$("#O${id}").click(() =>{$(".outgoingMessageList #O2${id}").show();$(".outgoingList").hide();$(".settingsOutgoing").hide();$(".messageBy").show();$(".settingsExitFromMessageOutgoing").show();$('.inScreen').prepend('<div class="outgoingMessageList" id="O2${id}"><div class="headerContacts">Outgoing message to ${num}</div><div class="messageBy" style="padding-left: 5px;padding-right: 5px;"><span style="word-wrap: break-word;">${text}</span></div>')});`)
    }
    function inComingMessage(id, num, text) {
      menu.execute(`$('.incomingList').append('<div class="buttonInContent incomingMessage" id="B${id}"><div class="textButtonInContent">${num}</div></div>')`)
      menu.execute(`$('.incomingMessageList').attr('id',${id})`)
      menu.execute(`$("#B${id}").click(() =>{$(".incomingMessageList #${id}").show();$(".incomingList").hide();$(".settingsOutgoing").hide();$(".messageBy").show();$(".settingsExitFromMessage").show();$('.inScreen').prepend('<div class="incomingMessageList" id="${id}"><div class="headerContacts">Incoming message from ${num}</div><div class="messageBy" style="padding-left: 5px;padding-right: 5px;"><span style="word-wrap: break-word;">${text}</span></div>')});`)
    }

    mp.events.add('create.telephone.message', (id, text, num, type) => {
      if (type)
          outComingMessage(id, num, text);
      else
          inComingMessage(id, num, text);
    })

    mp.events.add("telephone.enable", (enable) => {
      menu.execute(`telephone.enable(${enable})`);
    });

    mp.events.add("telephone.enable", (enable) => {
      menu.execute(`telephone.enable(${enable})`);
    });

    mp.events.add("telephone.call", (num) => {
      if (!num) return mp.events.call("nWarning", "Number not found!");
      if (num.length < 3) return mp.events.call("nWarning", "The number is not valid!");
      if (num.length > 8) return mp.events.call("nWarning", "The number is not valid!");
      mp.events.callRemote('call.player.contact', num)
    });

    mp.events.add("telephone.active", (enable) => {
      if (!our_number) return mp.events.call(`nError`, `Phone number not loaded!`);
      mp.enableTelephone = enable;
      if (our_number && enable) mp.game.ui.notifications.showWithPicture(t('moderation:joinLock.defaultPrivateMessage'), "uHNetwork", "Your phone number is: ~g~" + our_number, "CHAR_CHAT_CALL", 1, true, 0, bgColor = [77, 77, 77], flashColor = [250, 166, 40, 200]); // Testing Better Notification
//        if (our_number && enable) mp.game.graphics.notify("Your phone number is: ~g~" + our_number);
	  mp.gui.cursor.show(enable, enable);
    });

    mp.events.add('update.telephone.contacts', (result) => {
        for (let i = 0; i < result.length; i++) {
            menu.execute(`$('.contactsList').append('<div class="contact" id="BС${result[i].id}"><div class="user">${result[i].name}</div></div>')`)
            menu.execute(`$("#BС${result[i].id}").click(() =>{$(".options").show();$(".contactsList").hide();$(".settings").hide();$(".settingsAction").show();$("#reciepent").val('${result[i].num}');$("#pass_id").val('${result[i].id}')});`)
        }
    })

    mp.events.add('change.telephone.contact', (id, name, num) => {
      menu.execute(`document.getElementById("BС${id}").innerHTML = '<div class="user">${name}</div>'`)
      menu.execute(`$("#BC${id} #reciepent").val('${num}')`);
      //  menu.execute(`$("#BC${id}").unbind();`);
      //  menu.execute(`$("#BС${id}").click(() =>{$(".options").show();$(".contactsList").hide();$(".settings").hide();$(".settingsAction").show();$("#reciepent").val('${num}');$("#pass_id").val('${id}')});`)
    });

    mp.events.add('create.telephone.contact', (id, name, num) => {
        createButton(id, name, num);
    })

    mp.events.add('selectChangeContact', (id, contactName, contactNumber) => {
      if (!contactName || !contactNumber) return mp.events.call("nWarning", "Fill the field correctly!");
      if (!contactNumber.match(/[0-9]/g)) return mp.events.call("nWarning", "Fill the field correctly!");
      if (contactName.length > 25) return mp.events.call("nWarning", "Text too long!");
      if (contactNumber.length < 3) return mp.events.call("nWarning", "Number too short!");
      if (contactNumber.length > 8) return mp.events.call("nWarning", "Number too long!");
      mp.events.callRemote('change.player.contact', id, contactName, contactNumber)
    })

    mp.events.add('deleteContact', (id) => {
        mp.events.callRemote('delete.player.contact', id)
    })

    mp.events.add('sendMessage', (id, textMessage) => {
        if (!textMessage) return mp.events.call("nWarning", "Fill the field correctly!");
        if (textMessage.length < 1) return mp.events.call("nWarning", "Text too short!");
        if (textMessage.length > 250) return mp.events.call("nWarning", "Text too long!");
        mp.events.callRemote('send.player.phonemessage', id, textMessage)
    })

    mp.events.add('select.add.contact', (contactName, contactNumber) => {
      if (!contactName || !contactNumber) return mp.events.call("nWarning", "Fill the field correctly!");
      if (!contactNumber.match(/[0-9]/g)) return mp.events.call("nWarning", "Fill the field correctly!");
      if (contactName.length > 25) return mp.events.call("nWarning", "Text too long!");
      if (contactNumber.length < 3) return mp.events.call("nWarning", "Number too short!");
      if (contactNumber.length > 8) return mp.events.call("nWarning", "Number too long!");
      mp.events.callRemote('create.player.contact', contactName, contactNumber)
    })

    function createButton(id, name, num) {
      menu.execute(`$('.contactsList').append('<div class="contact" id="BС${id}"><div class="user">${name}</div></div>')`)
      menu.execute(`$("#BС${id}").click(() =>{$(".options").show();$(".contactsList").hide();$(".settings").hide();$(".settingsAction").show();$("#reciepent").val('${num}');$("#pass_id").val('${id}')});`)
    };
}
