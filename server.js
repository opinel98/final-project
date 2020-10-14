// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const ejs = require('ejs');
const app = express();
const server = require('http').server(app);
let io = require('socket.io')(server);


app.set('view engine', 'ejs');

let userdb = null;
let online = "";
online = "Joe";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbPassword@cluster0.ui701.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  userdb = client.db("a3").collection("users");
  // perform actions on the collection object
});


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/game.html");
});


// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// set up socket io for the chat room


let io = socket.listen(server);
io.sockets.on('connection', function () {
  console.log('hello world im a hot socket');
});

// listen for requests :)
app.listen(3000,() => {
  console.log('listening on *:3000');
});
