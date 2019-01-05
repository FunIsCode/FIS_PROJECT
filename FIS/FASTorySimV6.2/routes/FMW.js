var express = require('express');
var router = express.Router();
var fs = require('fs');
var Configuration={};
var events = require('events');
var eventEmitter = new events.EventEmitter();
var Client = require('node-rest-client').Client;
var client = new Client();



fs.readFile('public/Configuration.json', 'utf8', function(err,data) {
		Configuration = JSON.parse(data); 
		eventEmitter.emit('startChange');
 });
eventEmitter.on('startChange', function(){
var app = express();
var http = require('http');
app.set('port', Configuration.SocketPort1);
var server = http.createServer(app);
server.listen(Configuration.SocketPort1);
var io = require('socket.io')(server);
io.on('connection',IO_Socket);
});

{var ZonesPresence =[[0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0],
					 [0,0,0,0,0]];
var RFIDIndication = [0,0,0,0,0,0,0,0,0,0,0,0];
var StopperIndication = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
var	PalletState =  [[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],  // [WS][Zone][Parts(0:empty, 1:red, 2:Green, 3:Blue)], Parts : pallet, Paper, Frame, Screen, Keyboard, PalletID , Recipe
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
					[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]];
var WS_State = [[0,0,0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]; //[Conveyor(BUSY/IDLE),Robot(BUSY/IDLE)] for WS1 [Conveyor(BUSY/IDLE),Robot(BUSY/IDLE),Inconv,outConv]
var InkoveMethod = 0;				// 0: Local , 1: REST
}
//setInterval(function(){console.log(ZonesPresence);},1000);
function IO_Socket(socket){
	console.log('Socket is connected in FMW');
	socket.on('Params', function(msg){
		PalletState = msg.PalletState;
		ZonesPresence = msg.ZonesPresence;
		RFIDIndication = msg.RFIDIndication;
		StopperIndication = msg.StopperIndication;
		WS_State = msg.WS_State;
		InkoveMethod = msg.InkoveMethod;
	});
	socket.on('Invoke', function(msg){
		var args = {data: {destUrl:Configuration.Host+":"+Configuration.Port+"/fmw"},headers:{"Content-Type": "application/json"}};
		client.post(msg.Link, args, function(data,response){});
	});
	
} 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('FMW', {ZonesPresence: ZonesPresence,RFIDIndication:RFIDIndication,StopperIndication:StopperIndication,PalletState:PalletState,WS_State:WS_State,InkoveMethod:InkoveMethod ,Host:Configuration.Host,Port:Configuration.Port,SocketPort1:Configuration.SocketPort1,SocketPort2:Configuration.SocketPort2,HostName : Configuration.Host+':'+Configuration.Port});
});


router.post('/', function(req, res, next) {
  res.end();
});



	

module.exports = router;
