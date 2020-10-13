// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

let online = null;
let userdb = null;


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

app.get("/", (request, response) => {
  response.redirect("/login")
});

app.get("/login", (request,response)=>{
  response.render("login.html");
})

app.post('/login', function(req, res){
  if(!req.body.id || !req.body.password){
    res.status("400");
    res.send("Invalid details!");
  } else {
    console.log("made it")

    var newUser = {id: req.body.id, password: req.body.password};
    userdb.findOne({id : req.body.id, password: req.body.password}, function (err, result) {
      if(!result){ // if user does not exist, register a new user
        userdb.insertOne(newUser)
      }
    })
    req.session.user = newUser;
    online = req.session.user;
    res.redirect('/home');
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
