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

//Check if both connections to the databases was successful
// var DB = accConn.Connection;
// DB.on('error', console.error.bind(console, 'connection error:'));
// DB.once('open', function(){
//   console.log("Connection to database established");
// });
// DB = aniConn.Connection;
// DB.on('error', console.error.bind(console, 'connection error:'));
// DB.once('open', function(){
//   console.log("Connection to database established");
// });

//Create the schemas that will hold the data in Mongodb
//These schemas are used for data validation and other db stuff
var accelScheme = db.Schema({id: Number, x: Number, y: Number, z: Number});
var earScheme = db.Schema({timestamp: Number, value: Number});
var animateScheme = db.Schema({keyframe: Number, rightArm: Number, leftArm: Number, rightLeg: Number, leftLeg: Number});

//Compile the shemas into models
var accel = accConn.model('accel', accelScheme);
var ear = accConn.model('ear', earScheme);
var animate = aniConn.model('animate', animateScheme);

/*
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
*/

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
   //  db.collection("Acceleration").find().toArray(function (error, results) {
   //      if (error) 
   //      {
   //        throw error;
   //      }
   //      else if(results.length == 0)
   //      {
		 //  console.log("There is nothing in the database");
   //        res.send("There is nothing");
   //      }
   //      else
   //      {
   // 	      res.send(results[results.length -1]);
   //      }
   // });
})

// This takes the accel data and stores it in the database
app.post('/accel', function (req, res) {
    req.body.id = 1;
    //db.collection("Acceleration").save({id:req.body.id, x:req.body.x, y:req.body.y, z:req.body.z});

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
  // dbAnimation.collection(req.body.collection).insert({keyframe:req.body.keyframe, 
  //                                                     rightArm:req.body.rightArm,
  //                                                     leftArm:req.body.leftArm,
  //                                                     rightLeg:req.body.rightLeg,
  //                                                     leftLeg:req.body.leftLeg});
  res.send("Saved keyframe " + req.body.keyframe + " to the database"); //I need to use Jade or something to be able to show interesting stuff here
})

app.post('/GetAnimationData', function(req, res) {
  var kf = parseInt(req.body.keyframe);
  var actions;
  animate.findOne({keyframe:kf}, function(err, data){
    if(!err)
    {
      res.json(data);
    }
    else
    {
      console.log(err);
    }
  });
  // dbAnimation.collection(req.body.collection).find({keyframe:kf}).limit(1).toArray(function (error, results) {
  //   if(error)
  //   {
  //     console.log(error);
  //     return;
  //   }
  //   else if(results.length == 0)
  //   {
  //     console.log("No data");
  //     return;
  //   }
  //   else{
  //     console.log("Data sent");
  //     res.json(results[0]);
  //   }
  // });
})

// Post request to store data from the ear
app.post('/earData', function (req, res) {
  //Collection is in the accel db for the moment 
   var earData = new ear({"timestamp":req.body.timestamp,"value":req.body.value});
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
   // db.collection("Ear").save({"timestamp":req.body.timestamp,"value":req.body.value});
})

//Get request to get the ear data
app.get('/earData', function(req, res){
  // db.collection("Ear").find().toArray(function (error, results) {
  //       if (error) 
  //       {
  //         throw error;
  //       }
  //       else if(results.length == 0)
  //       {
		//       console.log("There is nothing in the database");
  //         res.send("There is nothing");
  //       }
  //       else
  //       {
  //  	      res.send(results);
  //       }
  // })
  ear.find({}, function(err, data){
    if(!err)
      res.send(data);
    else
      console.log("There was an error");
  });
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
