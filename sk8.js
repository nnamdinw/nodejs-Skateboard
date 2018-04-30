
const fs = require('fs');
const map = require('through2-map');  //for modifying streams in transit chunk-wise
const url = require('url');
const BufferList = require('bl'); //bufferlist for appending buffers
const three = require('three');
var express = require('express');
var app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var mysql = require('mysql');
var lastIndex = 0;



var dataIn = new BufferList(); //construct our empty buffer list
var piConnection = false;
var pi_lastConnection = 0;
var switchboard = [0,0,0,0];

var con = mysql.createConnection({
	host:"localhost",
	user: "root",
	password: "",
	database: "pods"
});


con.connect(function(err){
	//if(err) throw err;
	console.log("MySql connected successfully");
	con.on('error', function(err) {
  console.log("[mysql error]",err);
});
});






function getType(p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
}

function createTrip(data)
{

	var timestamp = Date.now();
	var currentID = 0;

	  var sql = "INSERT INTO sk8_trips VALUES (0," + timestamp + ")";
	  con.query(sql, function (err, result) {
	    //if (err) throw err;
	    console.log("1 record inserted");
	    
	  });

	  var sql = "SELECT max(ID) as id from sk8_trips";
	  	con.query(sql, function (err, result) {
	    
	    if (err) 
    	{
    		return err;
    	}
	  //currentID = result['max(id)'];
	  //  console.log(result[0].id);
	    currentID = result[0].id;
		for(var i = 2; i < data.length;i++)
		{	
				//console.log(nFrames[i]);
				try 
				{
	
					var obj = JSON.parse(data[i]);
				}
				catch(e)
				{
					console.log(e);
				}
			addTripData(obj,currentID);
		}

	  });
}

function addTripData(trip,index)
{
	  trip =  trip.data;
	  var sql = "INSERT INTO sk8_data VALUES (" + index + "," + trip.index + "," + trip.ax + "," + trip.ay + "," + trip.az + "," + trip.q0 + "," + trip.q1 + "," + trip.q2 + "," + trip.q3 + "," + trip.rpm + "," + trip.wheelspeed + ")";
	  //console.log(sql);

	  con.query(sql, function (err, result) 
	  {
		    if (err)
		    {
		    	console.log(err);
		    }
		    console.log("1 record inserted");
	  });


}
function parseTrip(data)
{
//blocking asf! make async pls
	var nFrames = data.split('\n');
	//nFrames.splice()

	
	var currentTrip = 0;


	currentTrip = createTrip(nFrames);
	//console.log("Successfully created: " + currentTrip);
	

	return "ok";

}


function parseFrame(data)
{


	data = JSON.parse(data);  //now we have the json from the PI!
	//dataIn.append(data);
	piConnection = true;
	if(data.data.index > lastIndex)
	{
		lastIndex = data.data.index;
	}
	else
	{
		return;
	}

		switchboard[0] = data; //this lets us know a new set of 30 pi frames is in 
		//switchboard[1] = [data.ax, data.ay, data.az];
		//switchboard[2] = [data.rpm, data.temperature];
		//switchboard[3] = [data.index, data.timestamp];
	
	console.log(data);
	//date = new Date();
	pi_lastConnection = Date.now();
	return "ok";
}





function consumeFrame(stream)
{



if(dataIn.length > 0)
{	
	return stream.pipe(dataIn).toString();
}
else
{
	return "No frames to display!";
}

}


function getTrips(res)
{

	  //console.log(sql);
	  var out = "";

	  var sql = "SELECT ID,Date from sk8_trips";
	  con.query(sql, function (err, result) 
	  {
		    if (err)
		    {
		    	console.log(err);
		    }

		res.json(result);	    
	  });

}


function getTrip(res,trip)
{
	var sql = "SELECT * from sk8_data where ID = " + trip;
	con.query(sql, function (err, result) 
	  {
		    if (err)
		    {
		    	console.log(err);
		    }

		res.json(result);	    
	  });

}




app.post('/addframe/:b64frame/',function (req,res){



	var decode = req.params;
	//decode = JSON.stringify(decode);
	decode = Buffer.from(decode.b64frame,'base64').toString();
	console.log(decode);
	var ew = /\0/g;
	decode = decode.replace(ew,"");

	//console.log(JSON.stringify(decode.toString()));
	res.send(parseFrame(decode));
	io.emit("pi_frame", switchboard[0]);


});

app.post('/addTrip/:b64frame/',function (req,res){



	var decode = req.params;
	//decode = JSON.stringify(decode);
	decode = Buffer.from(decode.b64frame,'base64').toString();
	//console.log(decode);
	var ew = /\0/g;
	decode = decode.replace(ew,"");

	//console.log(JSON.stringify(decode.toString()));
	res.send(parseTrip(decode));
	//io.emit("pi_frame", switchboard[0]);


});


app.get('/allTrips',function (req,res){
	
	getTrips(res);
	
});

app.get('/Trip/:atrip',function (req,res){
	
	var tTrip = req.params;
	tTrip = tTrip.atrip;

	getTrip(res,tTrip);
	
});


app.get('/',function (req,res){
	
	res.sendFile(__dirname + '/3js.html');
});
/*

	if(switchboard[0] != 0){

	
		io.emit("pi_frame",switchboard[0]);
	//	socket.emit('pi_frame',switchboard[0]);
		switchboard[0] == 0;

		console.log('pi frame');
	   
	//	console.log('pi_frame');
	}
*/

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function(socket) {

	console.log('a user connected');



	socket.on('pi_frame',function(msg) {
	 io.emit('pi_frame', msg);
	//console.log('message ' + message);
	

});
});




http.listen(8080,function() {
	console.log('listening on *:8080');
})