module.exports = {
    "playerJoin": (player) => {
        //console.log(`playerJoin: ${player.name}`);
        //player.state = 0;
        //player.spawn(new mp.Vector3(-789.35, -121.19, 19.95)); //metro
        player.spawn(new mp.Vector3(34.58, 856.84, 197.76)); //пирс
        //player.spawn(new mp.Vector3(2185.73, 259.42, 261.52)); //холм
        //player.spawn(new mp.Vector3(-66.43, -820.07, 326.08)); // крыша
        //player.spawn(new mp.Vector3(402.91, -996.86, -99)); // стандартное место создания перса
        //player.spawn(new mp.Vector3(123.2, -229.06, 54.55)); // место создания перса (магаз шмоток)
        player.model = mp.joaat("MP_M_Freemode_01");
        player.heading = 339.71;
        player.dimension = 10000 + player.id; //чтобы игроки не стримились друг другу

        player.outputChatBox(`Waiting for download...`);
    }
}
