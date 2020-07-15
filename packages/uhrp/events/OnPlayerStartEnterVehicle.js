module.exports = {
    "playerStartEnterVehicle": (player) => {
        //debug(player.vehicle.mileage);
        //player.call(`setVehicleVar`, [player.vehicle, "mileage", player.vehicle.mileage]);
        if (player.getVariable("attachedObject")) {
          if (player.job === 9 && player.getVariable("attachedObject") === "hei_prop_heist_binbag") return;
          if (player.job === 7 && player.builder) {
            let jobOpen = require("../modules/jobs/builder/job.js");
            jobOpen.stopBringingLoad(player);
          }
          player.setVariable("attachedObject", null);
        }
    }
}
