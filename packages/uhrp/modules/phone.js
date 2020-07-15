// ограничения в TODO
const PhoneControl = {
  free_numbers: [],
  max_numbers: 10000,
  special_numbers: []
};

module.exports = {
    Init: () => {
      DB.Handle.query("SELECT * FROM phone_special", (e, result) => {
        for (let i = 0; i < result.length; i++) PhoneControl.special_numbers.push(result[i].number);
        console.log(`[Rooms] Uploaded ${result.length} special rooms`);
      });
      DB.Handle.query("SELECT * FROM phone_taken", (e, result) => {
        let max = PhoneControl.max_numbers, array = [];
        for (let i = 0; i < result.length; i++) array.push(result[i].num);
        for (let i = 0; i < max; i++) {
          let num = getRandomNumber(100000, 999999);
          if (!array.includes(num)) PhoneControl.free_numbers.push(num); // console.log(`[${i}] ТЕЛЕФОН - ${num} | ${result.num}`);
          else max++;
        }
        console.log(`[Rooms] Uploaded ${PhoneControl.free_numbers.length} free rooms`);
      });
    }
}

global.initPlayerTelephone = function(player) {
  player.phone.createContact = (name, num) => {
    let array = player.phone.contacts;
    if (!array) return;
    if (num == player.phone.number) return player.utils.error("You can't make your number!");
    for (let i = 0; i < array.length; i++) if (array[i].num === num) return player.utils.error("You already have contact with this number!");
    DB.Handle.query("SELECT * FROM characters WHERE phone=?", [num], (e, sresult) => {
         let sendid = -1;
         if (sresult.length < 1 && !PhoneControl.special_numbers.includes(parseInt(num, 10))) return player.utils.error("The number doesn't exist!");
         if (PhoneControl.special_numbers.includes(parseInt(num, 10))) sendid = -10;
         else sendid = sresult[0].id;
         DB.Handle.query("INSERT INTO phone_contacts (creator, name, num, sender) VALUES (?,?,?,?)",
         [player.sqlId, name, num, sendid], (e, result) => {
            player.phone.contacts.push({ id: result.insertId, creator: player.sqlId, name: name, num: num, sender: sendid });
            player.call("create.telephone.contact", [result.insertId, name, num]);
            player.utils.success("Вы создали новый контакт!");
         });
    });
  };
  player.phone.call = (num) => {
    if (num == player.phone.number) return player.utils.error("You can't call your number!");
    let id = PhoneControl.special_numbers.indexOf(parseInt(num, 10));
    if (id != -1) {
      switch (++id) {
        case 13:
            let taxiOpen = require("./jobs/taxi/taxi.js");
            taxiOpen.recallTaxi(player);
            break;
        default: player.utils.error("Subscriber is temporarily unavailable!");
      }
    } else {
      // Звонки игроков
      player.utils.error("Subscriber is temporarily unavailable!");
    }
  };
  player.phone.changeContact = (id, name, num) => {
    let array = player.phone.contacts;
    if (num == player.phone.number) return player.utils.error("You can't make your number!");
    if (!array) return;
    for (let i = 0; i < array.length; i++) {
      if (array[i].num == num && array[i].id != id) player.utils.error("You already have contact with this number!");
      else if (array[i].id == id) {
        DB.Handle.query("SELECT * FROM characters WHERE phone=?", [num], (e, result) => {
             let result_st = result.length < 1 ? false : true;
             let special_st = !PhoneControl.special_numbers.includes(parseInt(num, 10)) ? false : true;
             if (!result_st && !special_st) return player.utils.error("The number doesn't exist!");
             else if (special_st) var status = -10;
             else var status = result[0].id;
             DB.Handle.query("UPDATE phone_contacts SET name=?,num=?,sender=? WHERE id=?", [name, num, status, id]);
             player.phone.contacts[i].name = name, player.phone.contacts[i].num = num, player.phone.contacts[i].sender = status;
             player.call("change.telephone.contact", [id, name, num]);
             player.utils.info("You edited the contact!");
             return;
        });
      }
    }
  };
  player.phone.deleteContact = (id) =>  {
    let array = player.phone.contacts;
    if (!array) return;
    for (let i = 0; i < array.length; i++) {
      if (array[i].id == id) {
          DB.Handle.query("DELETE FROM phone_contacts WHERE id=?", [id]);
          player.phone.contacts.splice(array[i], 1);
          player.utils.error("You deleted the contact!");
      }
    }
  };
  player.phone.sendMessage = (id, text) => {
    let array = player.phone.contacts;
    if (!array) return;
    for (let i = 0; i < array.length; i++) {
      if (array[i].id == id) {
        if (array[i].num == player.phone.number) return player.utils.error("Вы не можете написать Message на свой номер!");
        if (PhoneControl.special_numbers.includes(parseInt(array[i].num, 10))) return player.utils.error("Вы не можете отправить Message на данный номер!");
        DB.Handle.query("INSERT INTO phone_messages (text, sender_num, creator_num) VALUES (?,?,?)",
        [text, player.phone.number, array[i].num], (e, result) => {
           // ОГРАНИЧЕНИЕ: player.phone.messages.push({ id: result.insertId, text: text, sender_num: player.phone.number, creator_num: array[i].num });
           player.call("create.telephone.message", [result.insertId, text, array[i].num, true]);
           player.utils.success("You sent a message!");
           let target = mp.players.getBySqlId(array[i].sender);
           if (target) {
             target.call("create.telephone.message", [result.insertId, text, player.phone.number, undefined]);
             target.utils.success("You received a message on your phone!");
           }
        });
      }
    }
  }
  player.call("update.player.telephone", [player.phone.number]);
  DB.Handle.query(`SELECT * FROM phone_contacts WHERE creator=?`, [player.sqlId], (e, result) => {
		if (e) {
			console.log(`Phone contacts are not downloaded for the character '${player.sqlId}'. ${e}`);
			return;
		}

		player.phone.contacts = result;
		player.call("update.telephone.contacts", [result]);
  });
  DB.Handle.query(`SELECT * FROM phone_messages WHERE sender_num=? OR creator_num=?`, [player.phone.number, player.phone.number], (e, result) => {
      // ОГРАНИЧЕНИЕ: player.phone.messages = result;
      player.call("update.telephone.messages", [result]);
  });
};

function getPhoneNumber() {
  // if (PhoneControl.free_numbers.length < 1) return getRandomNumber(100000, 999999);
  if (PhoneControl.free_numbers.length < 1) return undefined;
  let num = getRandomNumber(0, PhoneControl.free_numbers.length);
  var number = PhoneControl.free_numbers[num];
  PhoneControl.free_numbers.splice(num, 1);
  return number;
}
module.exports.getPhoneNumber = getPhoneNumber;

// ВРЕМЕННО ДЛЯ ТЕСТОВ!!!
function getPhoneNumbers(player) {
   if (player.phone.number == -1) {
     let num = getRandomNumber(0, PhoneControl.free_numbers.length);
     player.phone.number = PhoneControl.free_numbers[num];
     DB.Handle.query("UPDATE characters SET phone=? WHERE id=?", [player.phone.number, player.sqlId]);
   }
}
module.exports.getPhoneNumbers = getPhoneNumbers;

mp.events.add('create.player.contact', (player, name, num) => {
    player.phone.createContact(name, num);
});
mp.events.add('change.player.contact', (player, id, name, num) => {
    player.phone.changeContact(id, name, num);
});
mp.events.add('call.player.contact', (player, num) => {
    player.phone.call(num);
});
mp.events.add('send.player.phonemessage', (player, id, text) => {
    player.phone.sendMessage(id, text);
});
mp.events.add('delete.player.contact', (player, id) => {
    player.phone.deleteContact(id);
});
function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
/*
if (Object.keys(player.inventory.getArrayByItemId(15)).length > 0) {
  DB.Handle.query(`SELECT * FROM phone_contacts WHERE creator=?`, [player.sqlId], (e, result) => {
      player.phone.contacts = result;
      player.call("update.telephone.contacts", [result]);
  });
};
*/
