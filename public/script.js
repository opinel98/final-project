
function clearTable(){
    var table = document.getElementById("table1");
    for(var i = table.rows.length - 1; i > 0; i--){
        table.deleteRow(i);
    }
};

function addEntryToTable(json){
    var row = document.getElementById("table1").insertRow();

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = json.user;
    cell2.innerHTML = json.difficulty;
    cell3.innerHTML = json.time;
    cell4.innerHTML = json.date;
};

window.onload = function (){ 
fetch("/load")
    .then(response => response.json())
    .then(entries => {    
        clearTable();
        entries = entries.sort((a,b) => parseFloat(a.time) - parseFloat(b.time))
        var i = 0;
        entries.forEach(e => {
                if (i < 10) {
                    addEntryToTable(e);
                    i++;
                }
            }
           );
    })
}

