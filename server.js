// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(session({secret: "Your secret key"}));


app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/views');

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
  console.log("in login")
  response.redirect("/login")
});

app.post("/login" ,async(request,response) => {
  try{
    let uin = request.body.id;
    let pin = request.body.password;
    console.log(uin)
    console.log(pin)
    //check a user with that uname exist- username are unique
    userdb.count({id: uin}).then(r =>{
      if(r > 0) {
        console.log(r)
        userdb.find({id: uin, password: pin}).toArray().then(res => {
          if (res[0]) {
            console.log("Autenticated")
            response.redirect("/");
            online = uin;

          } else {
            let m = "Fail"
            console.log(m)
            response.redirect("/login");
          }
        })
      }
      else{
          let newUser = {id: uin,password: pin}
          userdb.insertOne(newUser)
          online = uin;
          console.log("new user created")
          response.redirect("/");
      }
    })
  }
  catch(e){
    console.log(e)
  }

})
app.get("/login", (request,response)=>{
  response.render("login.html");
})


// listen for requests :)
app.listen(3000);
