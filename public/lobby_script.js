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

        document.getElementById('welcome').innerText = 'Hi ' + u + ', welcome back!'

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
           else if(c.difficulty === "hard") {
               hardCount++;
           }
           else {
               mediumCount++;
           }
       })
        document.getElementById('easy').innerText = 'You won ' + easyCount + ' easy games'
        document.getElementById('medium').innerText = 'You won ' + mediumCount + ' medium games'
        document.getElementById('hard').innerText = 'You won ' + hardCount + ' hard games'
    });
}





