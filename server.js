var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoClient = require("mongodb").MongoClient;
var db = require("mongoose");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Connect mongoose to the database
var accConn = db.createConnection('mongodb://127.0.0.1:27017/accel');
var aniConn = db.createConnection('mongodb://127.0.0.1:27017/animation');

//Create the schemas that will hold the data in Mongodb
//These schemas are used for data validation and other db stuff
var accelScheme = db.Schema({id: Number, x: Number, y: Number, z: Number});
var earScheme = db.Schema({timestamp: Number, value: Number});
var animateScheme = db.Schema({keyframe: Number, rightArm: Number, leftArm: Number, rightLeg: Number, leftLeg: Number});

//Compile the shemas into models
var accel = accConn.model('accel', accelScheme);
var ear = accConn.model('ear', earScheme);
var animate = aniConn.model('animate', animateScheme);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/index', function (req, res) {
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
  accel.find({id:1}, function(err, data){
    if(err) console.log("There was an error getting the data");
    res.json(data);
  });
})

// This takes the accel data and stores it in the database
app.post('/accel', function (req, res) {
    req.body.id = 1;
    var acceleraionData = new accel({id:req.body.id, x:req.body.x, y:req.body.y, z:req.body.z});
    acceleraionData.save(function (err, accelData){
      if(err) console.log("There was a problem saving the data");
    });
    res.send("These values are saved are " + req.body.id + " : " + req.body.x );
})

app.post('/animation', function (req, res)
{
  console.log("Recieved animation post");
  console.log(req.body); 
  var animationData = new animate({keyframe:req.body.keyframe, 
                                   rightArm:req.body.rightArm,
                                   leftArm:req.body.leftArm,
                                   rightLeg:req.body.rightLeg,
                                   leftLeg:req.body.leftLeg});
  animationData.save(function(err, data){
    if(err) console.log("There was an error saving the data");
  })

  res.send("Saved keyframe " + req.body.keyframe + " to the database"); //I need to use Jade or something to be able to show interesting stuff here
})

app.post('/GetAnimationData', function(req, res) {
  var kf = parseInt(req.body.keyframe);
  var actions;
  animate.findOne({keyframe:kf}, function(err, data){
    if(!err)
    {
      console.log(data);
      res.json(data);
    }
    else
    {
      console.log(err);
    }
  });
})

//Get request to get the ear data
app.get('/earData', function(req, res){
  ear.find({}, function(err, data){
    if(!err)
      res.send(data);
    else
      console.log("There was an error");
  });
})

app.get('/earData/:timestamp', function(req, res){
  ear.find({timestamp:req.params.timestamp}, function(err, data){
    if(!err)
    {
      res.send(data);
    }
    else
    {
      console.log("There was an error");
    }
  })
})

// Post request to store data from the ear
app.post('/earData', function (req, res) {
  //Collection is in the accel db for the moment 
  var date = new Date().toLocaleString();
   var earData = new ear({"timestamp":req.body.timestamp,"value":req.body.value});
    console.log("earData: " + date);
   ear.find({timestamp:req.body.timestamp}, function(err, data){
    if(!err)
    {
	console.log(data);
      if(data.length == 0)
      {
        earData.save(function(err, earData){
          if(err) 
          {
            console.log("There was was an error");
            res.send("There was an error");
          }
          else
          {
            res.send("The data was saved");
          }
        });
      }
      else
      {
        ear.findOneAndUpdate({timestamp:req.body.timestamp}, {'value':req.body.value}, {upsert:true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
        });
      }
    }
   })
})


// This is for Naomi
app.get('/Page1', function (req, res) {
   console.log("Naomi connected");
   res.sendFile( __dirname + "/public/" + "page1.htm" );
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.post('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   console.log(req.body);
   res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
