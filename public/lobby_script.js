let u = null;
let easyCount = 0;
let hardCount = 0;
let mediumCount = 0;

window.onload = function (e) {
    e.preventDefault();
    fetch('/getUser', {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        u = data.id;

        document.getElementById('welcome')
            .innerText = 'Hi ' + u + ', Welcome back!\nStats: '
        //document.getElementById("welcome").innerText = 'Stats: '

    })
}
getWins();

function getWins(){
    fetch('/getUserData',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json()) // parse the JSON from the server
    .then(entries => {
       entries.forEach(c=>{
           if(c.difficulty === "easy"){
               easyCount++;
           }
           else if(c.difficulty === "medium") {
               mediumCount++;
           }
           else {
               hardCount++;
           }
       })
        document.getElementById('easyN').innerText = easyCount
        document.getElementById('easy').innerText = ' Easy games won'
        document.getElementById('mediumN').innerText = mediumCount
        document.getElementById('medium').innerText = ' Medium games won'
        document.getElementById('hardN').innerText = hardCount
        document.getElementById('hard').innerText = ' Hard games won'
    });
}





