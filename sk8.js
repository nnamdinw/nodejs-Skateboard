
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
var lastIndex = 0;



var dataIn = new BufferList(); //construct our empty buffer list
var piConnection = false;
var pi_lastConnection = 0;
var switchboard = [0,0,0,0];

function getType(p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
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


function threeOutput()
{

	var out = ""

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

function clearFrames()
{

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