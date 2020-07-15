import myEventEmmiter from '../helpers/events';
import { history } from '../helpers/history';

export const PlayerEvents = (dispatch, getState) => {

    myEventEmmiter.on('clearCEF', (data) => {
		history.push('/clear');
    });
    
    myEventEmmiter.on('playerMenu', (data) => {
        var event = data.event;
        if(event === "enable") {
            window.playerMenu.enable(data.status);
        } else if(event === "bizes") {
            window.clientStorage.bizes[data.Id].adress = data.adress;
        } else if(event === "houses") {
            window.clientStorage.houses[data.Id].adress = data.adress;
        } else if(event === "chat") {
            window.chatAPI.changeOptions(data.chat);
            window.playerMenu.changeOptions(event, data.chat);
        } else if(event === "hud") {
            window.playerMenu.changeOptions(event, data.hud);
        } else if(event === "nickname") {
            window.playerMenu.changeOptions(event, data.nickname);
        } else if(event === "nickId") {
            window.playerMenu.changeOptions(event, data.nickId);
        } else if(event === "cars") {
            window.playerMenu.changeOptions(event, data.cars);
        } else if(event === "reports") {
            window.playerMenu.changeOptions(event, data.reports);
        } else if(event === "achievements") {
            window.playerMenu.changeOptions(event, data.achievements);
        } else if(event === "achievementsPlayer") {
            window.playerMenu.changeOptions(event, data.achievementsPlayer);
        } else if(event === "spawn") {
            window.playerMenu.changeOptions(event, data.spawn);
        } else if(event === "houseId") {
            window.playerMenu.changeOptions(event, data.houseId);
        }
    });

    myEventEmmiter.on('carSystem', (data) => {
        if(event == 'specShow') {
           
        }
    });

    myEventEmmiter.on('documents', (data) => {
        var event = data.event;
        if(event === "medic") {
            window.medicCerf.enable(true);
            dispatch({
                type: 'documents.medic',
                params: {
                    medic: data.medic 
                }
            });
        }
    });

    myEventEmmiter.on('autoSaloon', (data) => {
        var event = data.event;
        if(event === "selectCarParam") {
            window.autoSaloon.changeOptions(event, data.selectCarParam);
        } else if(event === "catalogData") {
            window.autoSaloon.changeOptions(event, data.catalogData);
        } else if(event === "colorSelect") {
            window.autoSaloon.changeOptions(event, data.colorSelect);
        } else if(event === "dim") {
            window.autoSaloon.changeOptions(event, data.dim);
        } else if(event === "enable") {
            if(data.enable === true) {
                window.playerMenu.enable(false);
                window.chatAPI.enable(false);
                window.inventoryAPI.enable(false);
            } else {
                window.playerMenu.enable(true);
                window.chatAPI.enable(true);
                window.inventoryAPI.enable(true);
            }
            window.autoSaloon.enable(data.enable);
        }
    });

    myEventEmmiter.on('fibTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.fibTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.fibTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.fibTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.fibTablet.changeOptions(event, data.removeCall);
        } else if(event === "addSearchPlayer") {
            window.fibTablet.changeOptions(event, data.addSearchPlayer);
        } else if(event === "enable") {
            window.fibTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('armyTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.armyTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.armyTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.armyTablet.changeOptions(event, data.addCall);
        } else if(event === "setInfoWareHouse") {
            window.armyTablet.changeOptions(event, data.setInfoWareHouse);
        } else if(event === "enable") {
            window.armyTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('medicTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.medicTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.medicTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.medicTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.medicTablet.changeOptions(event, data.removeCall);
        } else if(event === "enable") {
            window.medicTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('pdTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.pdTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.pdTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.pdTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.pdTablet.changeOptions(event, data.removeCall);
        } else if(event === "addSearchPlayer") {
            window.pdTablet.changeOptions(event, data.addSearchPlayer);
        } else if(event === "enable") {
            window.pdTablet.enable(data.status);
        }
    });
};
