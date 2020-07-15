var event;

function policePassportPading(str, max = 5) {
    const string = str.toString();
    return string.length < max ? policePassportPading(`0${string}`, max) : string;
}
function policeSendData(data, param) {
    data = JSON.parse(data);
    const arr = data.Name.split(/\s+/);

    inventoryAPI.show(false);

    event = param;

    document.getElementById('policePassport_name').innerHTML = arr[0];
    document.getElementById('policePassport_name2').innerHTML = arr[1];

    if (data.Sex) {
        document.getElementById('policePassport_sex').innerHTML = 'Male';
    } else document.getElementById('policePassport_sex').innerHTML = 'Female';

    document.getElementById('policePassport_years').innerHTML = convertMinutesToLevelRest(data.Minutes).level;
    document.getElementById('policePassport_rank').innerHTML = data.Rank;
    document.getElementById('policePassport_area').innerHTML = data.Area;

    document.getElementById('policePassport_id').innerHTML = policePassportPading(data.ID.toString(), 5);

    $(`#policePassport`).fadeIn("fast");
    promptAPI.showByName("documents_help");
    $(document).unbind("keydown", policeEHandler);
    $(document).keydown(policeEHandler);
}
 // policeSendData(JSON.stringify({ Name: 'Ilya Gilfanov', Sex: 1, Minutes: 25, Rank: 'Сержант', ID: 1, Area: '#1' }));

function policeEHandler(e) {
    if (e.keyCode == 69) { // E
        if(event == 2) inventoryAPI.show(true);
        $(`#policePassport`).fadeOut("fast");
        $(document).unbind("keydown", policeEHandler);
    }
}
