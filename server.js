var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoClient = require("mongodb").MongoClient;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var db;
MongoClient.connect("mongodb://127.0.0.1:27017/accel", function(error, database) {
    if (error) throw error;
    console.log("Connection to database established");
    db = database;
});
var dbAnimation;
MongoClient.connect("mongodb://127.0.0.1:27017/animation", function(error, database) {
    if (error) throw error;
    console.log("Connection to animation database established");
    dbAnimation = database;
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "home.htm" );
})

app.get('/controller', function(req, res) {
   res.sendFile(__dirname + "/public/DashboardControl.htm");
})

// This responds with the lastest accel data
app.get('/accel', function (req, res) {
    db.collection("Acceleration").find().toArray(function (error, results) {
        if (error) 
        {
          throw error;
        }
        else if(results.length == 0)
        {
		  console.log("There is nothing in the database");
          res.send("There is nothing");
        }
        else
        {
   	      res.send(results[results.length -1]);
        }
   });
})

// This takes the accel data and stores it in the database
app.post('/accel', function (req, res) {
    req.body._id = 1;

    db.collection("Acceleration").save({_id:req.body._id, x:req.body.x, y:req.body.y, z:req.body.z});
	res.send("These values are saved are " + req.body );
})

app.post('/animation', function (req, res)
{
  console.log("Recieved animation post");
  console.log(req.body); 
  dbAnimation.collection(req.body.collection).insert({keyframe:req.body.keyframe, 
                                                      rightArm:req.body.rightArm,
                                                      leftArm:req.body.leftArm,
                                                      rightLeg:req.body.rightLeg,
                                                      leftLeg:req.body.leftLeg});
  res.send("Saved keyframe " + req.body.keyframe + " to the database"); //I need to use Jade or something to be able to show interesting stuff here
})

// This responds a DELETE request for the /del_user page.
app.post('/earData', function (req, res) {
  //Collection is in the accel db for the moment 
   db.collection("Ear").save({"timestamp":req.body.timestamp,"value":req.body.value});
   res.send(req.body);
})

app.get('/earData', function(req, res){
  db.collection("Ear").find().toArray(function (error, results) {
        if (error) 
        {
          throw error;
        }
        else if(results.length == 0)
        {
		  console.log("There is nothing in the database");
          res.send("There is nothing");
        }
        else
        {
   	      res.send(results);
        }
})
})

// This is for Naomi
app.get('/Page1', function (req, res) {
   console.log("Naomi connected");
   res.sendFile( __dirname + "/public/" + "page1.htm" );
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
