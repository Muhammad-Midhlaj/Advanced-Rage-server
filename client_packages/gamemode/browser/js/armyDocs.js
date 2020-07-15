// { status: false, name: 'Ilya Gilfanov', date: '01.02.2019', rank: 'Капитан', id: 17538 }
// true - Активный | false - В отставке
function armyDocs(data) {
    data = JSON.parse(data);
    if (data.status) {
        document.getElementById("armyDocs_active").style.display = 'block';
    } else document.getElementById("armyDocs_retired").style.display = 'block';
    document.getElementById("armyDocs_name").innerHTML = data.name;
    document.getElementById("armyDocs_date").innerHTML = data.date;
    document.getElementById("armyDocs_rank").innerHTML = data.rank;
    document.getElementById("armyDocs_id").innerHTML = `No. ${data.id}`;
}