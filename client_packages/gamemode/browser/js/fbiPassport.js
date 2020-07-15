function fbiPassportPading(str, max = 5) {
    const string = str.toString();
    return string.length < max ? fbiPassportPading(`0${string}`, max) : string;
}
function fbiSendData(data) {
    data = JSON.parse(data);
    document.getElementById('fbiPassport_name').innerHTML = data.Name;
    document.getElementById('fbiPassport_id').innerHTML = fbiPassportPading(data.ID.toString(), 5);
}
// fbiSendData(JSON.stringify({ Name: 'Ilya Gilfanov', ID: 1 }));
