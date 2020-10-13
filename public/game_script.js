// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}

var context = null;

var gameTime = 0, lastFrameTime = 0;
var currentSecond = 0, frameCount = 0, frameLastSecond = 0;

var offsetX = 0, offsetY = 0;
var grid = [];

var mouseState = {
  x      :0,
  y      :0,
  click  :0
};
var gameState = {
    difficulty  : 'easy',
    screen      : 'menu',
    newBest     : false,
    timeTaken   : 0,

    tileW       : 20,
    tileH       : 20
};
var difficulties = {
    easy        : {
          name        : 'Easy',
          width       : 10,
          height      : 10,
          mines       : 10,
          bestTime    : 0,
          menuBox     : [0,0],
    },
    medium      : {
          name        : 'Easy',
          width       : 12,
          height      : 12,
          mines       : 20,
          bestTime    : 0,
          menuBox     : [0,0],
    },
    hard       : {
          name        : 'Easy',
          width       : 15,
          height      : 15,
          mines       : 50,
          bestTime    : 0,
          menuBox     : [0,0],
    }
};

function Tile(x, y)
{
    this.x = x;
    this.y = y;
    this.hasMine = false;
    this.danger = 0;
    this.currentState = 'hidden';
}
Tile.prototype.calcDanger = function(){
    var cDiff = difficulties[gameState.difficulty];

    for(var py = this.y - 1; py <= this.y + 1; py++){
        for(var px = this.x - 1; px <= this.x + 1; px++){
            if(px == this.x && py == this.y ){
                continue;
            }
            if(px < 0 || py < 0 || px >= cDiff.width || py >= cDiff.height){
                continue;
            }
            if(grid[((py*cDiff.width)+px)].hasMine){
                this.danger++;
            }
        }
    }
};
Tile.prototype.flag = function (){
  if(this.currentState == 'hidden') {
      this.currentState = 'flagged';
  }
  else if(this.currentState == 'flagged') {
      this.currentState = 'hidden';
  }
};
Tile.prototype.click = function(){
    if(this.currentState != 'hidden') {
        return;
    }
    if(this.hasMine) {
        gameOver();
    }
    else if(this.danger > 0) {
        this.currentState = 'visible';
    }
    else{
        this.currentState = 'visible';
        this.revealNeighbours();
    }

    checkState();
};
Tile.prototype.revealNeighbours = function()
{
    var cDiff = difficulties[gameState.difficulty];

    for(var py = this.y -1; py <= this.y + 1; py++){
        for(var px = this.x - 1; px <= this.x + 1; px++){
            if(px == this.x && py == this.y){ continue;}

            if(px < 0 || py < 0 || px >= cDiff.width || py >= cDiff.height){
                continue;
            }

            var idx = ((py * cDiff.width) +px);

            if(grid[idx].currentState == 'hidden'){
                grid[idx].currentState = 'visible';

                if(grid[idx].danger == 0){
                     grid[idx].revealNeighbours();
                }
            }
        }
    }
};

function checkState(){
    for(var i in grid) {
        if (grid[i].hasMine == false && grid[i].currentState != 'visible') {
            return;
        }
    }
    gameState.timeTaken = gameTime;
    var cDiff = difficulties[gameState.difficulty];

    if(cDiff.bestTime == 0 || gameTime < cDiff.bestTime){
        gameState.newBest = true;
        cDiff.bestTime = gameTime;
    }

    gameState.screen = 'won';
};

function gameOver(){
    gameState.screen = 'lost';
};

function startLevel(diff){
    gameState.newBest =false;
    gameState.timeTaken = 0;
    gameState.difficulty = diff;
    gameState.screen = 'playing';

    gameTime = 0;
    lastFrameTime = 0;

    grid.length = 0;

    var cDiff = difficulties[diff];

    offsetX = Math.floor((document.getElementById('game').width -(cDiff.width * gameState.tileW)) / 2);

    offsetY = Math.floor((document.getElementById('game').height - (cDiff.height * gameState.tileH)) / 2);

    for(var py = 0; py < cDiff.height; py++){
        for(var px = 0; px < cDiff.width; px++){
            var idx =((py * cDiff.width) + px);

            grid.push(new Tile(px, py));
        }
    }

    var minesPlaced = 0;

    while(minesPlaced < cDiff.min){
        var idx = Math.floor(Math.random() * grid.length);

        if(grid[idx].hasMine){ continue;}

        grid[idx].hasMine = true;
        minesPlaced++;
    }
    for(var i in grid) {
        grid[i].calcDanger();
    }
};

function updateGame(){
    if(gameState.screen == 'menu'){
        if(mouseState.click != null){
            for(var i in difficulties){
                if(mouseState.y >= difficulties[i].menuBox[0] && mouseState.y <= difficulties[i].menuBox[1]){
                    startLevel(i);
                    break;
                }
            }
            mouseState.click = null;
        }
    }
    else if(gameState.screen == 'won' || gameState.screen ==  'lost'){
        if(mouseState.click != null){
            gameState.screen = 'menu';
            mouseState.click = null;
        }
    }
    else{
        if(mouseState.click != null){
            var cDiff = diffculties[gameState.difficulty];

            if(mouseState.click[0] >= offsetX &&
                mouseState.click[1] >= offsetY &&
                mouseState.click[0] < (offsetX + (cDiff.width * gameState.tileW)) &&
                mouseState.click[1] < (offsetY + (cDiff.height * gameState.tileH)))
            {
                var tile = [
                    Math.floor((mouseState.click[0].offsetX) / gameState.tileW),
                    Math.floor((mouseState.click[1].offsetY) / gameState.tileH)
                ];

                if(mouseState.click[2] == 1){
                    grid[((tile[1] * cDiff.width) + tile[0])].click();
                }
                else{
                    grid[((tile[1] * cDiff.width) + tile[0])].flag();
                }
            }
            else if(mouseState.click[1] >= 380){
                gameState.screen = 'menu';
            }

            mouseState.click = null;
        }
    }
};

window.onload = function(){
    ctx = document.getElementById('game').getContext('2d');

    document.getElementById('game').addEventListener('contextmenu',
        function(e){
        e.preventDefault();
        var pos = realPos(e.pageX, e.pageY);
        mouseState.click = [pos[0], pos[1], 2];
        return false;
        });

    requestAnimationFrame(drawGame);
};

function drawMenu(){
    ctx.textAlign = 'center';
    ctx.font = 'bold 20py sans-serif';
    ctx.fillStyle = '#000000';

    var y = 100;

    for(var d in difficulties){
        var mouseOver = (mouseState.y >= (y - 20) && mouseState.y <= (y + 10));

        if(mouseOver){
            ctx.fillStyle = '#000099';
        }

        difficulties[d]
    }
};

// fetch the initial list of dreams
fetch("/dreams")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  
    // listen for the form to be submitted and add a new dream when it is
    dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newDream = dreamsForm.elements.dream.value;
      dreams.push(newDream);
      appendNewDream(newDream);

      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });
  });
