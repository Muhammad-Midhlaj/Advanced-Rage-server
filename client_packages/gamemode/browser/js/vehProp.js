//Parameters for speedometer
var speedStep = 1; //(endSpeedAngle - startSpeedAngle) / 180;

var lastVelocity = 0;

var isOnn;
var params = {
    belt: true,
};

$(document).ready(() => {
    $('#velocity').css("font-size", `${$('#velocity').height() - 5}px`);
    $('#gear').css("font-size", `${$('#gear').height() - 5}px`);
    $('.rpm-scale div').css("font-size", `${$('.rpm-scale div').height()}px`);
    $('.velocity-scale div').css("font-size", `${$('.velocity-scale div').height() * 0.9}px`);
    $('#rpmText').css("font-size", `${$('#rpmText').height() * 0.9}px`);
    $('#speedText').css("font-size", `${$('#speedText').height() * 0.7}px`);
    $('#mileage div').css("font-size", `${$('#mileage').height() * 0.9}px`);
    $('#max-velocity text').css("font-size", `${$('#max-velocity').height() * 0.4}px`);
});

function TestFanction(isOn) {
    SpeedometerBorderHandler(isOn);
    IndicatorHandler($("#oil-on"), isOn);
    IndicatorHandler($("#engine-on"), isOn);
    IndicatorHandler($("#battery-on"), isOn);
    IndicatorHandler($("#doors-on"), isOn);
    IndicatorHandler($("#high-beam-on"), isOn);
    IndicatorHandler($("#parking-light-on"), isOn);
    IndicatorHandler($("#low-beam-on"), isOn);
    IndicatorHandler($("#safety-belt-on"), isOn);
    IndicatorHandler($("#max-velocity-on"), isOn);
    IndicatorHandler($("#leftTurnSignal-on"), isOn);
    IndicatorHandler($("#rightTurnSignal-on"), isOn);
    IndicatorHandler($("#emergency-on"), isOn);
}

var parkingWidth;

function SpeedometerBorderHandler(isOn) {
    isOnn = isOn;

    var val = (isOn) ? "on" : "";

    $("#rpm").attr("class", `${val}`);
    $("#speedometer").attr("class", `${val}`);
    $("#fuel").attr("class", `${val}`);

    if (parkingWidth)
        $("#indicator-parking-light").css("width", parkingWidth);

    if (isOn) {

        if (!parkingWidth)
            parkingWidth = $("#indicator-parking-light").css("width");

        $('.rpm-bar').show();
        $('.speedometer-bar').show();

        var val = (params.belt) ? "red-on" : "off";
        $("#indicator-safety-belt").attr("class", `${val}`);

        var val = (params.leftSignal) ? "green-on" : "off";
        $("#leftTurnSignal svg").attr("class", `${val}`);

        var val = (params.rightSignal) ? "green-on" : "off";
        $("#rightTurnSignal svg").attr("class", `${val}`);

        var val = (params.emergency) ? "on" : "off";
        $("#emergency svg").attr("class", `${val}`);

        var val = (params.doors) ? "red-on" : "off";
        $("#indicator-doors").attr("class", `${val}`);

        var val = (params.lBeam) ? "green-on" : "off";
        $("#indicator-low-beam").attr("class", `${val}`);

        var val = (params.parking) ? "green-on" : "off";
        $("#indicator-parking-light").attr("class", `${val}`);

        var val = (params.hBeam) ? "blue-on" : "off";
        $("#indicator-high-beam").attr("class", `${val}`);

        var val = (params.engine) ? "yellow-on" : "off";
        $("#indicator-engine").attr("class", `${val}`);

        var val = (params.engine) ? "red-on" : "off";
        $("#indicator-oil").attr("class", `${val}`);

        var val = (params.engine) ? "red-on" : "off";
        $("#indicator-battery").attr("class", `${val}`);

    } else {
        $('.rpm-bar').hide();
        $('.speedometer-bar').hide();

        var val = (params.belt) ? "red-on" : "";
        $("#indicator-safety-belt").attr("class", `${val}`);

        var val = (params.leftSignal) ? "green-on" : "";
        $("#leftTurnSignal svg").attr("class", `${val}`);

        var val = (params.rightSignal) ? "green-on" : "";
        $("#rightTurnSignal svg").attr("class", `${val}`);

        var val = (params.emergency) ? "on" : "";
        $("#emergency svg").attr("class", `${val}`);

        var val = (params.doors) ? "red-on" : "";
        $("#indicator-doors").attr("class", `${val}`);

        var val = (params.lBeam) ? "green-on" : "";
        $("#indicator-low-beam").attr("class", `${val}`);

        var val = (params.parking) ? "green-on" : "";
        $("#indicator-parking-light").attr("class", `${val}`);

        var val = (params.hBeam) ? "blue-on" : "";
        $("#indicator-high-beam").attr("class", `${val}`);

        var val = (params.engine) ? "yellow-on" : "";
        $("#indicator-engine").attr("class", `${val}`);

        var val = (params.engine) ? "red-on" : "";
        $("#indicator-oil").attr("class", `${val}`);

        var val = (params.engine) ? "red-on" : "";
        $("#indicator-battery").attr("class", `${val}`);
    }

}

var MileageHandler = (milage) => {
    if (mileage == null || !isNaN(mileage) || !isOnn) milage = 0;
    milage = parseInt(milage * 10);
    for (var i = 0; i < 7; i++) {

        if (parseInt($(`#mileage${i} div`).first().text()) != milage % 10) {
            $(`#mileage${i}`).prepend(`<div>${milage % 10}</div>`);

            $(`#mileage${i} div`).first().css({
                "margin-top": "-100%",
            });

            $(`#mileage${i} div`).first().animate({
                margin: 0,
            }, 400, () => {
                $(`#mileage${i} div`).last().remove();
            });
        }
        milage = parseInt(milage / 10);
    }
}

var SpeedHandler = (velocity) => {
    /*$('#velocity').text(parseInt(velocity));*/
    $('#velocity').text((isOnn) ? parseInt(velocity) : "0");

    var iVel = velocity - lastVelocity;

    if (Math.abs(iVel) > 1) velocity = lastVelocity + iVel * 0.09;
    lastVelocity = velocity;
    velocity *= 0.74;

    $('#speedometer circle').css('strokeDasharray', `${velocity}% 290%`);
}

//Parameters for fuel
var FuelHandler = (fuel) => {
    $('#fuelRed').css('clip-path', `inset(0 0 ${fuel}% 0)`);
    $('#fuelWhite').css('clip-path', `inset(${100 - fuel}% 0 0 0)`);
}

//Parameters for rpm
var lastRpm = 0;
var RpmHandler = (rpm) => {
    var iRpm = rpm - lastRpm;

    if (Math.abs(iRpm) > 0.001) rpm = lastRpm + iRpm * 0.09;
    lastRpm = rpm;

    rpm *= 100;
    $('#rpm circle').css('strokeDasharray', `${rpm}% 290%`);
}

//Gear
var t = true;
var GearHandler = (gear) => {
    $('#gear').text((isOnn) ? gear : "N");
}

//Signals
var leftTimer;
var LeftSignalHandler = (enable) => {
    if (enable) {
        if (leftTimer) return;
        leftTimer = setInterval(() => {
            params.leftSignal = !params.leftSignal;
        }, 500);
    } else {
        params.leftSignal = false;
        clearInterval(leftTimer);
        leftTimer = null;
    }
}
var rightTimer;
var RightSignalHandler = (enable) => {
    if (enable) {
        if (rightTimer) return;
        rightTimer = setInterval(() => {
            params.rightSignal = !params.rightSignal;
        }, 500);
    } else {
        params.rightSignal = false;
        clearInterval(rightTimer);
        rightTimer = null;
    }
}

//Emergency
var emergencyTimer;
var EmergencyHandler = (enable) => {
    if (enable) {
        if (emergencyTimer) return;
        LeftSignalHandler(false);
        RightSignalHandler(false);
        LeftSignalHandler(true);
        RightSignalHandler(true);
        emergencyTimer = setInterval(() => {
            params.emergency = !params.emergency;
        }, 500);
    } else {
        params.emergency = false;
        clearInterval(emergencyTimer);
        emergencyTimer = null;
    }
}

//Doors Locked
var LockedHandler = (enable) => {
    params.doors = enable;
}

//Safety Belt
var BeltHandler = (enable) => {
    params.belt = enable;
}

//Engine Broken
var EngineBrokenHandler = (enable) => {
    params.engine = enable;
}

//Oil Broken
var OilBrokenHandler = (enable) => {
    params.oil = enable;
}

//Accumulator Broken
var AccumulatorBrokenHandler = (enable) => {
    params.battery = enable;
}

//Lights
var LightsHandler = (type) => {
    switch (type) {
        case 0:
            params.hBeam = false;
            params.parking = false;
            params.lBeam = false;
            break;
        case 1:
            params.hBeam = false;
            params.parking = true;
            params.lBeam = false;
            break;
        case 2:
            params.hBeam = false;
            params.parking = false;
            params.lBeam = true;
            break;
        case 3:
            params.hBeam = true;
            params.parking = false;
            params.lBeam = false;
            break;
    }
}

var getPatternMilage = (value) => {

    value = parseInt(value) + "";
    var length = 6;
    var valueLen = value.length;
    for (var i = valueLen; i < length; i++)
        value = "0" + value;
    return value;
}

//MainFanction
var VehPropHandler = (velocity, fuel, rpm, gear) => {
    $('#velocity').css("font-size", `${$('#velocity').height() - 5}px`);
    $('#gear').css("font-size", `${$('#gear').height() - 5}px`);
    $('.rpm-scale div').css("font-size", `${$('.rpm-scale div').height()}px`);
    $('.velocity-scale div').css("font-size", `${$('.velocity-scale div').height() * 0.9}px`);
    $('#rpmText').css("font-size", `${$('#rpmText').height() * 0.9}px`);
    $('#speedText').css("font-size", `${$('#speedText').height() * 0.7}px`);
    $('#mileage div').css("font-size", `${$('#mileage').height() * 0.9}px`);
    $('#max-velocity text').css("font-size", `${$('#max-velocity').height() * 0.4}px`);
    SpeedHandler(velocity);
    RpmHandler(rpm);
    FuelHandler(fuel);
    if (velocity < 1 && velocity >= 0 && rpm > 0.5)
        gear = 1;
    else if (velocity < 1 && velocity >= 0)
        gear = "N";
    else if (velocity != 0 && gear == 0)
        gear = "R";
    GearHandler(gear);
}

var HideVehProp = () => {
    $('#vehProp').hide();
    lastSpeed = 0;
    lastFuel = 0;
    lastRpm = 0;
    VehPropHandler(0, 0, 0, 0);
}

function rotateHandler() {
    $('#rpm circle').css('strokeDasharray', `${$('#rpmRotate').val()}% 290%`);
    $('#rpmRotate').val();
}
