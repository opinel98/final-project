// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const ejs = require('ejs');
const app = express();

var socket = require('socket.io');
const server = require('http').Server(app);
app.set('view engine', 'ejs');
var bodyParser = require('body-parser')
var date = require('date-fns');
var session = require('express-session');
var cookieParser = require('cookie-parser')


app.use(cookieParser());
app.use(session({secret: "Your secret key"}));


// info plug ins for password hashing
const saltRounds = 10;
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/views');

let online = null;
let userdb = null;
let gamedb = null;

online = "Joe";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbPassword@cluster0.ui701.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  userdb = client.db("a3").collection("users");
  gamedb = client.db("a3").collection("games");
  // perform actions on the collection object
});


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/player_lobby.html");
// });

// set up socket io for the chat room
let io = socket.listen(server);
io.sockets.on('connection', function () {
  console.log('hello world im a hot socket');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  })
});

app.get("/game", (request, response) => {
  console.log('in game')
  response.render('player_lobby.html')

});

// route for getting user data
app.get("/getUserData", (request, response) => {
  if( gamedb !== null ) {
    // get array and pass to res.json
    gamedb.find({user:request.session.uid }).toArray().then( result => {
      response.json(result)})
  }
});





// all the routes for the sidebar
app.get("/chat", (request, response) => {
  if(request.session.uid) {
  response.render('menu/Chat.html')
}
else{
  response.redirect("/");
}
});

app.get("/home", (request, response) => {
  if(request.session.uid) {
  response.redirect("/game")
  }
  else{
    response.redirect("/");
  }
});

app.get("/globalBoard", (request, response) => {
  if(request.session.uid) {
  response.render('menu/global_leaderboard.html')
  }
  else{
    response.redirect("/");
  }
});

app.get("/playGame", (request, response) => {
 if(request.session.uid) {
   response.render('game.html')
 }
 else{
   response.redirect("/");
 }
});

app.get("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/")
});
//****************************** side bar routes******************
app.get("/", (request, response) => {
  console.log("in login")
  response.render("login.html");
});

app.post("/loginAttempt" ,async(request,response) => {
  try{
    let uin = request.body.id;
    let pin = request.body.password;
    console.log(uin)
    console.log(pin)
    //check a user with that uname exist- username are unique
    userdb.count({id: uin}).then(r =>{
      if(r > 0) {
        console.log(r)
        userdb.find({id: uin}).toArray().then(res => {
          if (res[0]) {
            bcrypt.compare(pin,res[0].password, function(err, c) {
              if (c === true) {
                console.log("Authenticated")
                online = uin;
                request.session.uid = uin;
                // response.redirect("/");
                response.send(JSON.stringify({id: request.session.uid}))
              }
              else {
                let m = "Fail"
                console.log(m)
                response.send('Didnt work')

                // response.redirect("/login");
              }
            })
          }
        })
      }
      else{
        let newUser = null;
        bcrypt.hash(pin, saltRounds, (err, hash) => {
          console.log(hash);
          newUser = {id: uin,password: hash}
          userdb.insertOne(newUser)
          online = uin;
          console.log("new user created")
          response.redirect("/game");
        });
      }
    })
  }
  catch(e){
    console.log(e)
  }
})

app.get("/load", (request, response) => {
  if( gamedb !== null ) {
    // get array and pass to res.json

    gamedb.find().toArray().then( result => {
      response.json(result)
    })
  }
  //response.json(JSON.stringify(data));
});

app.get('/getUser', (req, res) => {
  res.json({id: req.session.uid});
})

app.post('/insertGame', (req, res) =>{
  console.log(res.body)

  var completedGame = {
    user : req.session.uid,
    difficulty: req.body.difficulty,
    time: req.body.time,
    date: date.format(new Date(), "yyyy-MM-dd")
  }

  gamedb.insertOne(completedGame)
  res.end()

})

// listen for requests :)
server.listen(3000,() => {
  console.log('listening on *:3000');
});

