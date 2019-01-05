var express = require('express');
var router = express.Router(); 
var Client = require('node-rest-client').Client;
var client = new Client();
var JSON_Data; 
var fs = require('fs');
var RTU_Obj;
var Configuration={};
var events = require('events');
var eventEmitter = new events.EventEmitter();
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
fs.readFile('public/Configuration.json', 'utf8', function(err,data) {
		Configuration = JSON.parse(data); 
		eventEmitter.emit('startChange');
 });
var io;


{ // Variables
CNV_eventsPayload={"id":"","senderID":"","lastEmit":"","payload":{"palletID":"", "count":0}};
ROB_eventsPayload={"id":"","senderID":"","lastEmit":"","payload":{"palletID":"", "count":0}};
CNV_dataPayload={"v":"","q":"good","t":""};
notify_Template ={"id1":{"id":"id1","links":{self: ""},"class":""}};	
					
errorTemplate = {
"code": 0,
"status": "error",
"message": "",
"data": ""
}

var	ZonesPresence = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var	RFIDIndication = [0,0,0,0,0,0,0,0,0,0,0,0];
var	StopperIndication = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
var	WS_State = [[0,0,0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];

var CNV_ServicesNotifs = [{},{},{},{},{},{},{},{},{},{},{},{}];
var CNV_EventsNotifs = 	 [{},{},{},{},{},{},{},{},{},{},{},{}];
var ROB_ServicesNotifs = [{},{},{},{},{},{},{},{},{},{},{},{}];
var ROB_EventsNotifs = 	 [{},{},{},{},{},{},{},{},{},{},{},{}];
var CNV_Queue =[{"TZ12":"0","TZ23":"0","TZ35":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ23":"0","TZ35":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
				{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"}];
var ServicesNotifsCount = 0;
var EventsNotifsCount = 0;
var PenColor = ['RED','RED','RED','RED','RED','RED','RED','RED','RED','RED','RED','RED'];
// response for Z services						
var RTU_Zones = [{"Z1":-1,"Z2":-1,"Z3":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z2":-1,"Z3":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
				 {"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1}]

var RTUID;
var RTUnotifs;
var ROBAlldata;
var ROB1services;
var ROBAllservices;
var ROB7services
var ROB1events;
var ROBAllevents;
var ROB7events;
var CNV1data;
var CNV7data;
var CNVAlldata;
var CNV1events;
var CNV7events;
var CNVAllevents;
var CNV1servcies;
var CNV7servcies;
var CNVAllservcies;
var DataAll;
var Swagger;
var RTU_Main;
eventEmitter.on('startChange', function(){
Configuration.baseUrl= Configuration.Host + ':' + Configuration.Port + '/RTU';
{ // object variables
fs.readFile('public/swagger.txt', 'utf8', function(err,data) {
		Swagger = JSON.parse(data); 
 });
fs.readFile('public/RTU.txt', 'utf8', function(err,data) {
		RTU_Obj = JSON.parse(data); 
 });
fs.readFile('public/RTUID.txt', 'utf8', function(err,data) {
		RTUID = data; 
		RTUID = RTUID.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/RTUnotifs.txt', 'utf8', function(err,data) {
		RTUnotifs = data; 
		RTUnotifs = RTUnotifs.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/DataAll.txt', 'utf8', function(err,data) {
		DataAll = data; 
		DataAll = DataAll.replace(/HostName/gi,Configuration.baseUrl);
 }); 
fs.readFile('public/CNV1data.txt', 'utf8', function(err,data) {
		CNV1data = data; 
		CNV1data = CNV1data.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNV1events.txt', 'utf8', function(err,data) {
		CNV1events = data;
		CNV1events = CNV1events.replace(/HostName/gi,Configuration.baseUrl); 
 });
fs.readFile('public/CNV1services.txt', 'utf8', function(err,data) {
		CNV1services = data; 
		CNV1services = CNV1services.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNVAlldata.txt', 'utf8', function(err,data) {
		CNVAlldata = data; 
		CNVAlldata = CNVAlldata.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNVAllevents.txt', 'utf8', function(err,data) {
		CNVAllevents = data; 
		CNVAllevents = CNVAllevents.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNVAllservices.txt', 'utf8', function(err,data) {
		CNVAllservices = data; 
		CNVAllservices = CNVAllservices.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNV7data.txt', 'utf8', function(err,data) {
		CNV7data = data; 
		CNV7data = CNV7data.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNV7events.txt', 'utf8', function(err,data) {
		CNV7events = data; 
		CNV7events = CNV7events.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/CNV7services.txt', 'utf8', function(err,data) {
		CNV7services = data; 
		CNV7services = CNV7services.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROB1services.txt', 'utf8', function(err,data) {
		ROB1services = data; 
		ROB1services = ROB1services.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROBAllservices.txt', 'utf8', function(err,data) {
		ROBAllservices = data; 
		ROBAllservices = ROBAllservices.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROB7services.txt', 'utf8', function(err,data) {
		ROB7services = data; 
		ROB7services = ROB7services.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROB1events.txt', 'utf8', function(err,data) {
		ROB1events = data; 
		ROB1events = ROB1events.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROB7events.txt', 'utf8', function(err,data) {
		ROB7events = data; 
		ROB7events = ROB7events.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROBAllevents.txt', 'utf8', function(err,data) {
		ROBAllevents = data; 
		ROBAllevents = ROBAllevents.replace(/HostName/gi,Configuration.baseUrl);
 });
fs.readFile('public/ROBAlldata.txt', 'utf8', function(err,data) {
		ROBAlldata = data;
		ROBAlldata = ROBAlldata.replace(/HostName/gi,Configuration.baseUrl); 
 });
 
RTU_Main = {"id": "FASTorysimulation",
				"links": {
				"self": Configuration.baseUrl,
					"info": Configuration.baseUrl+"/info",
					"reset":Configuration.baseUrl+"/reset"
				},
				"class": "node",
				"children": {
					"CNV1": {
						"id": "CNV1",
						"links": {
							"self": Configuration.baseUrl+"/CNV1",
							"info": Configuration.baseUrl+"/CNV1/info"
						},
						"class": "escopRTU"
					},
					"ROB1": {
						"id": "ROB1",
						"links": {
							"self": Configuration.baseUrl+"/ROB1",
							"info": Configuration.baseUrl+"/ROB1/info"
						},
						"class": "escopRTU"
					},
					"CNV2": {
						"id": "CNV2",
						"links": {
							"self": Configuration.baseUrl+"/CNV2",
							"info": Configuration.baseUrl+"/CNV2/info"
						},
						"class": "escopRTU"
					},
					"ROB2": {
						"id": "ROB2",
						"links": {
							"self": Configuration.baseUrl+"/ROB2",
							"info": Configuration.baseUrl+"/ROB2/info"
						},
						"class": "escopRTU"
					}, 
					"CNV3": {
						"id": "CNV3",
						"links": {
							"self": Configuration.baseUrl+"/CNV3",
							"info": Configuration.baseUrl+"/CNV3/info"
						},
						"class": "escopRTU"
					}, 
					"ROB3": {
						"id": "ROB3",
						"links": {
							"self": Configuration.baseUrl+"/ROB3",
							"info": Configuration.baseUrl+"/ROB3/info"
						},
						"class": "escopRTU"
					},
					"CNV4": {
						"id": "CNV4",
						"links": {
							"self": Configuration.baseUrl+"/CNV4",
							"info": Configuration.baseUrl+"/CNV4/info"
						},
						"class": "escopRTU"
					},
					"ROB4": {
						"id": "ROB4",
						"links": {
							"self": Configuration.baseUrl+"/ROB4",
							"info": Configuration.baseUrl+"/ROB4/info"
						},
						"class": "escopRTU"
					},
					"CNV5": {
						"id": "CNV5",
						"links": {
							"self": Configuration.baseUrl+"/CNV5",
							"info": Configuration.baseUrl+"/CNV5/info"
						},
						"class": "escopRTU"
					},
					"ROB5": {
						"id": "ROB5",
						"links": {
							"self": Configuration.baseUrl+"/ROB5",
							"info": Configuration.baseUrl+"/ROB5/info"
						},
						"class": "escopRTU"
					},
					"CNV6": {
						"id": "CNV6",
						"links": {
							"self": Configuration.baseUrl+"/CNV6",
							"info": Configuration.baseUrl+"/CNV6/info"
						},
						"class": "escopRTU"
					},
					"ROB6": {
						"id": "ROB6",
						"links": {
							"self": Configuration.baseUrl+"/ROB6",
							"info": Configuration.baseUrl+"/ROB6/info"
						},
						"class": "escopRTU"
					},
					"CNV7": {
						"id": "CNV7",
						"links": {
							"self": Configuration.baseUrl+"/CNV7",
							"info": Configuration.baseUrl+"/CNV7/info"
						},
						"class": "escopRTU"
					},
					"ROB7": {
						"id": "ROB7",
						"links": {
							"self": Configuration.baseUrl+"/ROB7",
							"info": Configuration.baseUrl+"/ROB7/info"
						},
						"class": "escopRTU"
					},
					"CNV8": {
						"id": "CNV8",
						"links": {
							"self": Configuration.baseUrl+"/CNV8",
							"info": Configuration.baseUrl+"/CNV8/info"
						},
						"class": "escopRTU"
					},
					"ROB8": {
						"id": "ROB8",
						"links": {
							"self": Configuration.baseUrl+"/ROB8",
							"info": Configuration.baseUrl+"/ROB8/info"
						},
						"class": "escopRTU"
					},
					"CNV9": {
						"id": "CNV9",
						"links": {
							"self": Configuration.baseUrl+"/CNV9",
							"info": Configuration.baseUrl+"/CNV9/info"
						},
						"class": "escopRTU"
					},
					"ROB9": {
						"id": "ROB9",
						"links": {
							"self": Configuration.baseUrl+"/ROB9",
							"info": Configuration.baseUrl+"/ROB9/info"
						},
						"class": "escopRTU"
					},
					"CNV10": {
						"id": "CNV10",
						"links": {
							"self": Configuration.baseUrl+"/CNV10",
							"info": Configuration.baseUrl+"/CNV10/info"
						},
						"class": "escopRTU"
					},
					"ROB10": {
						"id": "ROB10",
						"links": {
							"self": Configuration.baseUrl+"/ROB10",
							"info": Configuration.baseUrl+"/ROB10/info"
						},
						"class": "escopRTU"
					},
					"CNV11": {
						"id": "CNV11",
						"links": {
							"self": Configuration.baseUrl+"/CNV11",
							"info": Configuration.baseUrl+"/CNV11/info"
						},
						"class": "escopRTU"
					},
					"ROB11": {
						"id": "ROB11",
						"links": {
							"self": Configuration.baseUrl+"/ROB11",
							"info": Configuration.baseUrl+"/ROB11/info"
						},
						"class": "escopRTU"
					},   
					"CNV12": {
						"id": "CNV12",
						"links": {
							"self": Configuration.baseUrl+"/CNV12",
							"info": Configuration.baseUrl+"/CNV12/info"
						},
						"class": "escopRTU"
					},
					"ROB12": {
						"id": "ROB12",
						"links": {
							"self": Configuration.baseUrl+"/ROB12",
							"info": Configuration.baseUrl+"/ROB12/info"
						},
						"class": "escopRTU"
					}
				}
			}
		}
var app = express();
var http = require('http');
app.set('port', Configuration.SocketPort2); 
var server = http.createServer(app);
server.listen(Configuration.SocketPort2);
var IO = require('socket.io')(server);
io = IO;
io.on('connection',IO_Socket);
});	

}
 function IO_Socket(socket){
	//console.log('Socket is connected in RTU');
	socket.on('Params',function(msg){
		ZonesPresence = msg.ZonesPresence;
		RFIDIndication = msg.RFIDIndication;
		StopperIndication = msg.StopperIndication;
		WS_State = msg.WS_State;
	})
	socket.on('Event',function(msg){
		var dd = new Date();
		var d = dd.getTime();
		if(msg.Msg=='ConveyorStartTransferring')
		{
			RTU_Zones[parseInt(msg.WS)-1]["Z"+msg.From] = -1;
			if(msg.From == '1')
			{	
				if(msg.WS == '1')
				{
					RTU_Zones[11]["Z5"] = -1;
				}
				else 
				{
					RTU_Zones[parseInt(msg.WS)-2]["Z5"] = -1;
				}
			}
			if(msg.From == '2' && msg.WS == '7')
			{
				RTU_Zones[parseInt(msg.WS)-2]["Z5"] = -1;
			}
			//emit the event
			var EventList = CNV_EventsNotifs[parseInt(msg.WS)-1];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('z'+msg.From)!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "Z"+msg.From+"_Changed";
					Args.senderID = "CNV"+msg.WS;
					Args.lastEmit = d;
					Args.payload = {PalletID : -1}
					Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
			if(msg.From == '1')
			{	
				if(msg.WS == '1')
				{
					var EventList = CNV_EventsNotifs[11];
					var keys = Object.keys(EventList).toString().split(",");
					for(var i = 0; (i<keys.length);i++)
					{
						if(keys[i].indexOf('z5')!=-1)
						{
							var destURL = EventList[keys[i]].destUrl;	
							var Args = {};
							Args.id = "Z5_Changed";
							Args.senderID = "CNV11";
							Args.lastEmit = d;
							Args.payload = {PalletID : -1}
							Args.clientData = EventList[keys[i]].clientData;
							if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
						}
					}
				}
				else 
				{
					var EventList = CNV_EventsNotifs[parseInt(msg.WS)-2];
					var keys = Object.keys(EventList).toString().split(",");
					for(var i = 0; (i<keys.length);i++)
					{
						if(keys[i].indexOf('z5')!=-1)
						{
							var destURL = EventList[keys[i]].destUrl;	
							var Args = {};
							Args.id = "Z5_Changed";
							Args.senderID = "CNV"+(parseInt(msg.WS)-1);
							Args.lastEmit = d;
							Args.payload = {PalletID : -1}
							Args.clientData = EventList[keys[i]].clientData;
							if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
						}
					}
				}
			}
		} 
		else if(msg.Msg=='ConveyorStopTransferring')
		{
			//console.log(msg)
			RTU_Zones[parseInt(msg.WS)-1]["Z"+msg.To] = msg.PalletID;
			if(msg.To == '5')
			{	
				if(msg.WS == '12')
				{
					RTU_Zones[0]["Z1"] = msg.PalletID;
				}
				else if(msg.WS == '6')
				{
					RTU_Zones[6]["Z2"] = msg.PalletID;
				}
				else
				{
					RTU_Zones[parseInt(msg.WS)]["Z1"] = msg.PalletID;
				}
			}
			// Check Queue
			if(msg.From == '2' && CNV_Queue[parseInt(msg.WS)-1]["TZ12"] != "0")
			{
				var Args = {WS:msg.WS,Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-1]["TZ12"]};
				Args.FromZone = '1'; 
				Args.ToZone = '2';
				Args.PalletID = RTU_Zones[parseInt(msg.WS)-1]["Z1"];
				io.emit('Process', Args);
				CNV_Queue[parseInt(msg.WS)-1]["TZ12"]="0";	
			}
			if(msg.From == '3' && CNV_Queue[parseInt(msg.WS)-1]["TZ23"] != "0")
			{
				var Args = {WS:msg.WS,Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-1]["TZ23"]};
				Args.FromZone = '2'; 
				Args.ToZone = '3';
				Args.PalletID = RTU_Zones[parseInt(msg.WS)-1]["Z2"];
				io.emit('Process', Args);
				CNV_Queue[parseInt(msg.WS)-1]["TZ23"]="0";
			}
			if(msg.From == '4' && CNV_Queue[parseInt(msg.WS)-1]["TZ14"] != "0")
			{
				var Args = {WS:msg.WS,Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-1]["TZ14"]};
				Args.FromZone = '1'; 
				Args.ToZone = '4';
				Args.PalletID = RTU_Zones[parseInt(msg.WS)-1]["Z1"];
				io.emit('Process', Args);
				CNV_Queue[parseInt(msg.WS)-1]["TZ14"]="0";
			}
			if (msg.WS !=1 && msg.WS !=8 && msg.WS!=2)
			{
				/* //console.log("youoyu")
				//console.log(msg.From == '1');
				//console.log(CNV_Queue[parseInt(msg.WS)-2]["TZ35"] == 1);
				//console.log(CNV_Queue[parseInt(msg.WS)-2]["TZ45"] == 0); */
				if(msg.From == '1' && CNV_Queue[parseInt(msg.WS)-2]["TZ35"] != "0" && CNV_Queue[parseInt(msg.WS)-2]["TZ45"] == "0")
				{
					var Args = {WS:JSON.stringify(parseInt(msg.WS)-1),Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-2]["TZ35"]};
					Args.FromZone = '3'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[parseInt(msg.WS)-2]["Z3"];
					io.emit('Process', Args);
					CNV_Queue[parseInt(msg.WS)-2]["TZ35"]="0";
				}
				else if((msg.From == '1') && (CNV_Queue[parseInt(msg.WS)-2]["TZ35"] == "0") && (CNV_Queue[parseInt(msg.WS)-2]["TZ45"] != "0"))
				{
					var Args = {WS:JSON.stringify(parseInt(msg.WS)-1),Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-2]["TZ45"]};
					Args.FromZone = '4'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[parseInt(msg.WS)-2]["Z4"];
					io.emit('Process', Args);
					CNV_Queue[parseInt(msg.WS)-2]["TZ45"]="0";
					
				}
				else if(msg.From == '1' && CNV_Queue[parseInt(msg.WS)-2]["TZ35"] != "0" && CNV_Queue[parseInt(msg.WS)-2]["TZ45"] != "0")
				{
					var Args = {WS:JSON.stringify(parseInt(msg.WS)-1),Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-2]["TZ35"]};
					Args.FromZone = '3'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[parseInt(msg.WS)-2]["Z3"];
					io.emit('Process', Args);
					CNV_Queue[parseInt(msg.WS)-2]["TZ35"]="0";
				}
			}
			if ( msg.WS ==8 || msg.WS==2)
			{
				if(msg.From == '1' && CNV_Queue[parseInt(msg.WS)-2]["TZ35"] != "0")
				{
					var Args = {WS:JSON.stringify(parseInt(msg.WS)-1),Process:'TransZone',destURL:CNV_Queue[parseInt(msg.WS)-2]["TZ35"]};
					Args.FromZone = '3'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[parseInt(msg.WS)-2]["Z3"];
					io.emit('Process', Args);
					CNV_Queue[parseInt(msg.WS)-2]["TZ35"]="0";
				}
			}
			else if (msg.WS == 1)
			{
				
				console.log("**********************************************")
				console.log((msg.From))
				console.log((CNV_Queue[11]["TZ35"]))
				console.log((CNV_Queue[11]["TZ45"]))
				console.log("**********************************************")
				if(msg.From == '1' && CNV_Queue[11]["TZ35"] != "0" && CNV_Queue[11]["TZ45"] == "0")
				{
					var Args = {WS:"12",Process:'TransZone', destURL:CNV_Queue[11]["TZ35"]};
					Args.FromZone = '3'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[11]["Z3"];
					io.emit('Process', Args);
					CNV_Queue[11]["TZ35"]="0";
				}
				else if(msg.From == '1' && CNV_Queue[11]["TZ35"] == "0" && CNV_Queue[11]["TZ45"] != "0")
				{
					var Args = {WS:"12",Process:'TransZone', destURL:CNV_Queue[11]["TZ45"]};
					Args.FromZone = '4'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[11]["Z4"];
					io.emit('Process', Args);
					CNV_Queue[11]["TZ45"]="0";
					console.log("##################################################################")
					console.log(Args)
					console.log("##################################################################")
					
				}
				else if(msg.From == '1' && CNV_Queue[11]["TZ35"] != "0" && CNV_Queue[11]["TZ45"] != "0")
				{
					var Args = {WS:"12",Process:'TransZone', destURL:CNV_Queue[11]["TZ35"]};
					Args.FromZone = '3'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[11]["Z3"];
					io.emit('Process', Args);
					CNV_Queue[11]["TZ35"]="0";
				}	
			}
			/* else
			{
				//console.log("yup")
				if(msg.From == '1' && CNV_Queue[parseInt(msg.WS)-2]["TZ35"] == 1)
				{
					//console.log("yup")
					var Args = {WS:JSON.stringify(parseInt(msg.WS)-1),Process:'TransZone',destURL:Configuration.Host+":"+Configuration.Port+"/fmw"};
					Args.FromZone = '3'; 
					Args.ToZone = '5';
					Args.PalletID = RTU_Zones[parseInt(msg.WS)-2]["Z3"];
					io.emit('Process', Args);
					CNV_Queue[parseInt(msg.WS)-2]["TZ35"]=0;
				}
			} */
			
			//emit the event
			var EventList = CNV_EventsNotifs[parseInt(msg.WS)-1];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('z'+msg.To)!=-1)
				{
				var destURL = EventList[keys[i]].destUrl;	
				var Args = {};
				Args.id = "Z"+msg.To+"_Changed";
				Args.senderID = "CNV"+msg.WS;
				Args.lastEmit = d;
				Args.payload = {PalletID : String(msg.PalletID)}
				//Args.clientData = EventList[keys[i]].clientData;
				if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
			// send for Zone1 changed in next ws
			if(msg.To == '5')
			{	
				if(msg.WS == '12')
				{
					var EventList = CNV_EventsNotifs[0];
					var keys = Object.keys(EventList).toString().split(",");
					for(var i = 0; (i<keys.length);i++)
					{
						if(keys[i].indexOf('z1')!=-1)
						{
							var destURL = EventList[keys[i]].destUrl;	
							var Args = {};
							Args.id = "Z1_Changed";
							Args.senderID = "CNV1";
							Args.lastEmit = d;
							Args.payload = {PalletID : String(msg.PalletID)}
				Args.clientData = EventList[keys[i]].clientData;
							if(destURL!="")
							{	
								var args = {data: {},headers:{"Content-Type": "application/json"}};
								args.data = Args;
								client.post(destURL, args, function(data,response){//console.log(data.toString());
								});
								//console.log("___________________________")
								//console.log("Notification sent to: "+destURL)
								//console.log(args)
								//console.log("___________________________")
							}
						}
					}
				}
				else if(msg.WS == '6')
				{
					var EventList = CNV_EventsNotifs[6];
					var keys = Object.keys(EventList).toString().split(",");
					for(var i = 0; (i<keys.length);i++)
					{
						if(keys[i].indexOf('z2')!=-1)
						{
							var destURL = EventList[keys[i]].destUrl;	
							var Args = {};
							Args.id = "Z2_Changed";
							Args.senderID = "CNV7";
							Args.lastEmit = d;
							Args.payload = {PalletID : String(msg.PalletID)}
				Args.clientData = EventList[keys[i]].clientData;
							if(destURL!="")
							{	
								var args = {data: {},headers:{"Content-Type": "application/json"}};
								args.data = Args;
								client.post(destURL, args, function(data,response){//console.log(data.toString());
								});
								//console.log("___________________________")
								//console.log("Notification sent to: "+destURL)
								//console.log(args)
								//console.log("___________________________")
							}
						}
					}
				}
				else 
				{
					var EventList = CNV_EventsNotifs[parseInt(msg.WS)];
					var keys = Object.keys(EventList).toString().split(",");
					for(var i = 0; (i<keys.length);i++)
					{
						if(keys[i].indexOf('z1')!=-1)
						{
							var destURL = EventList[keys[i]].destUrl;	
							var Args = {};
							Args.id = "Z1_Changed";
							Args.senderID = "CNV"+(parseInt(msg.WS)+1);
							Args.lastEmit = d;
							Args.payload = {PalletID : String(msg.PalletID)}
				Args.clientData = EventList[keys[i]].clientData;
							if(destURL!="")
							{	
								var args = {data: {},headers:{"Content-Type": "application/json"}};
								args.data = Args;
								client.post(destURL, args, function(data,response){//console.log(data.toString());
								});
								//console.log("___________________________")
								//console.log("Notification sent to: "+destURL)
								//console.log(args)
								//console.log("___________________________")
							}
						}
					}
				}
			}
		}
		else if(msg.MSG == 'PalletLoaded')
		{
			console.log('*******************************************');
			console.log('*******************************************');
			console.log('*******************************************');
			console.log('*******************************************');
			console.log('*******************************************');
			console.log('*******************************************');
			RTU_Zones[6]["Z3"] = msg.PalletID;
			// emit notification
			var EventList = CNV_EventsNotifs[6];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('z3')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "Z3_Changed";
					Args.senderID = "CNV7";
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
			var EventList = ROB_EventsNotifs[6];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('pl')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "PalletLoaded";
					Args.senderID = "ROB7";
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'PalletUnloaded')
		{
			RTU_Zones[6]["Z3"] = -1;
			// emit notifs
			var EventList = CNV_EventsNotifs[6];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('z3')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "Z3_Changed";
					Args.senderID = "CNV7";
					Args.lastEmit = d;
					Args.payload = {PalletID :-1}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
			var EventList = ROB_EventsNotifs[6];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('pu')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "PalletUnloaded";
					Args.senderID = "ROB7";
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'PaperLoaded')
		{
			var EventList = ROB_EventsNotifs[0];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('pl')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "PaperLoaded";
					Args.senderID = "ROB1";
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
			
		}
		else if(msg.MSG == 'PaperUnloaded')
		{
			var EventList = ROB_EventsNotifs[0];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('pu')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "PaperUnloaded";
					Args.senderID = "ROB1";
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'PenChanged' ) 
		{
			var EventList = ROB_EventsNotifs[parseInt(msg.WS)-1];;
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('nepc')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "PenChanged";
					Args.senderID = "ROB"+msg.WS;
					Args.lastEmit = d;
					Args.payload = {PenColor:msg.Color}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
			
		}
		else if(msg.MSG =='RobotStartDrawing')
		{
			var EventList = ROB_EventsNotifs[parseInt(msg.WS)-1];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('dse')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "DrawStartExecution";
					Args.senderID = "ROB"+msg.WS;
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID,Recipe : msg.Recipe}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'RobotStopDrawing')
		{
			var EventList = ROB_EventsNotifs[parseInt(msg.WS)-1];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('dee')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "DrawEndExecution";
					Args.senderID = "ROB"+msg.WS;
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID,Recipe : msg.Recipe,Color:PenColor[parseInt(msg.WS)-1]}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'OutOfInk')
		{
			var EventList = ROB_EventsNotifs[parseInt(msg.WS)-1];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('neooi')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "OutOfInk";
					Args.senderID = "ROB"+msg.WS;
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID,Color: msg.Color}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'LowInkLevel')
		{
			var EventList = ROB_EventsNotifs[parseInt(msg.WS)-1];
			var keys = Object.keys(EventList).toString().split(",");
			for(var i = 0; (i<keys.length);i++)
			{
				if(keys[i].indexOf('nelil')!=-1)
				{
					var destURL = EventList[keys[i]].destUrl;	
					var Args = {};
					Args.id = "LowInkLevel";
					Args.senderID = "ROB"+msg.WS;
					Args.lastEmit = d;
					Args.payload = {PalletID : msg.PalletID,Color: msg.Color}
				Args.clientData = EventList[keys[i]].clientData;
					if(destURL!="")
					{	
						var args = {data: {},headers:{"Content-Type": "application/json"}};
						args.data = Args;
						client.post(destURL, args, function(data,response){//console.log(data.toString());
						});
						//console.log("___________________________")
						//console.log("Notification sent to: "+destURL)
						//console.log(args)
						//console.log("___________________________")
					}
				}
			}
		}
		else if(msg.MSG == 'PalletCountChanged')
		{
			console.log(msg)
			// issue event for subs
		}
		else if(msg.MSG == 'OpreationFinished')
		{
			var destURL = msg.destURL;
			if(destURL!="")
			{	
				var args = {data: {},headers:{"Content-Type": "application/json"}};
				args.data = Args;
				client.post(destURL, args, function(data,response){console.log(data.toString());
				});
				console.log("___________________________")
				console.log("Callback  sent to: "+destURL)
				console.log(args)
				console.log("___________________________")
				
			}
		}
	});
}

router.get('/*',function(req, res, next){
	var Res_Obj = {};
	var OrginalURL = req.originalUrl;
	var LINK = OrginalURL.split("/");
	var ReqLink = '';
	for (var i =0; i< LINK.length ; i++)
	{
		if(LINK[i] == '')
		{
			LINK.splice(i,1);
		}
	}
	if(LINK.length == 3 && LINK[0]=='RTU' && LINK[2] == 'swagger')
	{
		var temp = RTU_Main.children;
		var KEYS = Object.keys(temp).toString().split(",");
		if(KEYS.indexOf(LINK[1])!=-1)
		{
			var temp = Swagger;
			temp.host = Configuration.Host.substr(7)+":" + Configuration.Port;
			temp.basePath = "/"+LINK[0]+"/"+LINK[1];
			Res_Obj = temp;
		}
		else
		{Res_Obj = 404}		
	}
	else if(LINK.length == 1 || (LINK.length==2 && LINK[1]=='info'))
	{// show RTU
		Res_Obj = RTU_Main
	}
	else 
	{
		var temp = RTU_Main.children;
		var KEYS = Object.keys(temp).toString().split(",");
		if(KEYS.indexOf(LINK[1])!=-1)
		{
			if(LINK[1].indexOf('CNV') > -1)	// CNV
			{
				if(LINK.length == 2 || (LINK.length==3 && LINK[2]=='info'))
				{// Show RTU/RTUID
					var temp = RTUID.replace(/RTUID/gi,LINK[1]);
					Res_Obj = JSON.parse(temp);
				}
				else
				{	
					var temp = RTUID.replace(/RTUID/gi,LINK[1]);
					var temp1 = JSON.parse(temp).children;
					var KEYS = Object.keys(temp1).toString().split(",");
					if(KEYS.indexOf(LINK[2])!=-1)
					{
						if(LINK[2]=='data')
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))
							{// Show RTU/RTUID/data
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1data;
									Res_Obj = JSON.parse(temp);
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7data;
									Res_Obj = JSON.parse(temp);
								}
								else
								{
									var temp = CNVAlldata.replace(/CNV/gi,LINK[1]);;
									Res_Obj = JSON.parse(temp);
								}
							}
							else
							{
								if(LINK[1]=='CNV1'&& LINK.length == 4)
								{
									var temp = CNV1data;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										if(LINK[3].indexOf("P") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=ZonesPresence[parseInt(LINK[1].substring(3))-1][parseInt(LINK[3].substring(1))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
										}
										if(LINK[3].indexOf("S") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=StopperIndication[parseInt(LINK[1].substring(3))-1][parseInt(LINK[3].substring(1))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
											}
										if(LINK[3].indexOf("R") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=RFIDIndication[parseInt(LINK[1].substring(3))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
										}
									}
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='CNV7'&& LINK.length == 4)
								{
									var temp = CNV7data;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										if(LINK[3].indexOf("P") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=ZonesPresence[parseInt(LINK[1].substring(3))-1][parseInt(LINK[3].substring(1))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
										}
										if(LINK[3].indexOf("S") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=StopperIndication[parseInt(LINK[1].substring(3))-1][parseInt(LINK[3].substring(1))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
											}
										if(LINK[3].indexOf("R") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=RFIDIndication[parseInt(LINK[1].substring(3))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
										}
									}
									else{Res_Obj = 404;}
								}
								else if(LINK.length == 4)
								{
									var temp = CNVAlldata;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										if(LINK[3].indexOf("P") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=ZonesPresence[parseInt(LINK[1].substring(3))-1][parseInt(LINK[3].substring(1))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
										}
										if(LINK[3].indexOf("S") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=StopperIndication[parseInt(LINK[1].substring(3))-1][parseInt(LINK[3].substring(1))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
											}
										if(LINK[3].indexOf("R") !=-1)
										{
											var d = new Date();
											var tempRes = CNV_dataPayload;
											tempRes.v=RFIDIndication[parseInt(LINK[1].substring(3))-1]
											tempRes.t = d.getTime();
											Res_Obj=tempRes;
										}
									}
									else{Res_Obj = 404;}
								}
								else if(LINK.length == 5 && LINK[4]=='info')
								{	
									if(LINK[1]=='CNV1')
									{
										var temp = CNV1data;
										var temp1 = JSON.parse(temp).children;
										var KEYS = Object.keys(temp1).toString().split(",");
										if(KEYS.indexOf(LINK[3])!=-1)
										{
											var temp = DataAll.replace(/RTUID/gi,LINK[1]);
											temp = temp.replace(/DataID/gi,LINK[3]);
											var temp2 = JSON.parse(temp);
											if(LINK[3].indexOf('S')!=-1){temp2.class = "output"}
											else{temp2.class = "input"}
											temp2.value = CNV_dataPayload;
											Res_Obj = temp2;
										} 
										else{Res_Obj = 404;}
									}
									else if(LINK[1]=='CNV7')
									{
										var temp = CNV7data;
										var temp1 = JSON.parse(temp).children;
										var KEYS = Object.keys(temp1).toString().split(",");
										if(KEYS.indexOf(LINK[3])!=-1)
										{
											var temp = DataAll.replace(/RTUID/gi,LINK[1]);
											temp = temp.replace(/DataID/gi,LINK[3]);
											var temp2 = JSON.parse(temp);
											if(LINK[3].indexOf('S')!=-1){temp2.class = "output"}
											else{temp2.class = "input"}
											temp2.value = CNV_dataPayload;
											Res_Obj = temp2;
										}
										else{Res_Obj = 404;}
									} 
									else 
									{
										var temp = CNVAlldata;
										var temp1 = JSON.parse(temp).children;
										var KEYS = Object.keys(temp1).toString().split(",");
										if(KEYS.indexOf(LINK[3])!=-1)
										{
											var temp = DataAll.replace(/RTUID/gi,LINK[1]);
											temp = temp.replace(/DataID/gi,LINK[3]);
											var temp2 = JSON.parse(temp);
											if(LINK[3].indexOf('S')!=-1){temp2.class = "output"}
											else{temp2.class = "input"}
											temp2.value = CNV_dataPayload;
											Res_Obj = temp2;
										}
										else{Res_Obj = 404;}
									}
									
								}
							}
						}
						else if(LINK[2]=='services')
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))
							{// Show RTU/RTUID/services
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1services;
									Res_Obj = JSON.parse(temp);
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7services;
									Res_Obj = JSON.parse(temp);
								}
								else
								{
									var temp = CNVAllservices.replace(/CNV/gi,LINK[1]);
									Res_Obj = JSON.parse(temp);
								}
							}
							else if(LINK.length == 4 && (LINK[3]=='TransZone12' ||LINK[3]=='TransZone23' ||LINK[3]=='TransZone35' ||LINK[3]=='TransZone14' ||LINK[3]=='TransZone45')||LINK.length == 5 && ((LINK[3]=='TransZone12' ||LINK[3]=='TransZone23' ||LINK[3]=='TransZone35' ||LINK[3]=='TransZone14' ||LINK[3]=='TransZone45') && LINK[4]=='info'))
							{
								
								var temp = CNVAllservices.replace(/CNV/gi,LINK[1]);
								var temp1 = JSON.parse(temp).children[LINK[3]];
								temp1.count = 0;
								temp1.lastRun = 0;
								Res_Obj = temp1;	
							}
							else if(LINK.length == 4 && (LINK[3]=='Z1' ||LINK[3]=='Z2' ||LINK[3]=='Z3' ||LINK[3]=='Z4' ||LINK[3]=='Z5')||LINK.length == 5 && ((LINK[3]=='Z1' ||LINK[3]=='Z2' ||LINK[3]=='Z3' ||LINK[3]=='Z4' ||LINK[3]=='Z5') && LINK[4]=='info') )
							{
								var temp = CNVAllservices.replace(/CNV/gi,LINK[1]);
								var temp1 = JSON.parse(temp).children[LINK[3]];
								temp1.count = 0;
								temp1.lastRun = 0;
								Res_Obj = temp1;
									
							}
							else if(LINK.length==5 && LINK[4]=='notifs')
							{
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1services;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_ServicesNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = CNV_ServicesNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;	
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7services;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = CNVAllservices.replace(/CNV/gi,LINK[1]);
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;
									} 
									else{Res_Obj = 404;}
								}
							}
						}
						else if(LINK[2]=='events')
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))
							{// Show RTU/RTUID/events
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1events;
									Res_Obj = JSON.parse(temp);
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7events;
									Res_Obj = JSON.parse(temp);
								}
								else
								{
									var temp = CNVAllevents.replace(/CNV/gi,LINK[1]);;
									Res_Obj = JSON.parse(temp);
								}
							}
							else if(LINK.length == 4)
							{
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp = CNV_eventsPayload;
										temp.id = LINK[3];
										temp.senderID = LINK[1];
										Res_Obj = temp;
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp = CNV_eventsPayload;
										temp.id = LINK[3];
										temp.senderID = LINK[1];
										Res_Obj = temp;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = CNVAllevents;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp = CNV_eventsPayload;
										temp.id = LINK[3];
										temp.senderID = LINK[1];
										Res_Obj = temp;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length == 5 && LINK[4] == 'info') // add id for eventrs notifs
							{
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;((i<keys.length)&&(keys[0]!=''));i++)
										{
											temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = CNVAllevents;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length == 5 && LINK[4] == 'notifs') // add id for eventrs notifs
							{
								if(LINK[1]=='CNV1')
								{
									var temp = CNV1events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
										var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
										temp2.id = LINK[3];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											if(CNV_EventsNotifs[temp][keys[i]].eventID == LINK[3]){
											temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];}
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='CNV7')
								{
									var temp = CNV7events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
										var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											if(CNV_EventsNotifs[temp][keys[i]].eventID == LINK[3]){
											temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];}
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
									var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
									var temp = CNVAllevents;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											if(CNV_EventsNotifs[temp][keys[i]].eventID == LINK[3]){
											temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];}
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length == 6 && LINK[4] == 'notifs') // add id for eventrs notifs
							{
								var notifsList = CNV_EventsNotifs[parseInt(LINK[1].substring(3))-1];
								var keys = Object.keys(notifsList).toString().split(",");
								if(keys.indexOf(LINK[5])!=-1)
								{
									var temp = notifsList[LINK[5]];
									Res_Obj = temp;
								}
								else{Res_Obj = 404;}
							}
							else{Res_Obj = 404;}
						}
						else
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))							
							{// Show RTU/RTUID/notifs
								
								var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
								var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
								temp = parseInt(LINK[1].substring(3))-1;
								var keys = Object.keys(CNV_ServicesNotifs[temp]).toString().split(",");
								for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
								{
									temp2.children[keys[i]] = CNV_ServicesNotifs[temp][keys[i]];
								}
								keys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
								for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
								{
									temp2.children[keys[i]] = CNV_EventsNotifs[temp][keys[i]];
								}
								Res_Obj = temp2;
							}
							else if(LINK.length == 4 || (LINK.length==5 && LINK[4]=='info'))
							{
								var temp = parseInt(LINK[1].substring(3))-1;
								var servkeys = Object.keys(CNV_ServicesNotifs[temp]).toString().split(",");
								var Evenkeys = Object.keys(CNV_EventsNotifs[temp]).toString().split(",");
								if(servkeys.indexOf(LINK[3])!=-1)
								{
									Res_Obj = CNV_ServicesNotifs[temp][LINK[3]]
								}
								else if(Evenkeys.indexOf(LINK[3])!=-1)
								{
									Res_Obj = CNV_EventsNotifs[temp][LINK[3]]
								}
								else{Res_Obj = 404;}
							}
						}
					}
					else{Res_Obj = 404;}
				}
			}
			else					// ROB
			{
				if(LINK.length == 2 || (LINK.length==3 && LINK[2]=='info'))
				{// Show RTU/RTUID
					var temp = RTUID.replace(/RTUID/gi,LINK[1]);
					Res_Obj = JSON.parse(temp);
				}
				else
				{	
					var temp = RTUID.replace(/RTUID/gi,LINK[1]);
					var temp1 = JSON.parse(temp).children;
					var KEYS = Object.keys(temp1).toString().split(",");
					if(KEYS.indexOf(LINK[2])!=-1)
					{
						if(LINK[2]=='data')
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))
							{// Show RTU/RTUID/data
								var temp = ROBAlldata.replace(/ROB/gi,LINK[1]);;
								Res_Obj = JSON.parse(temp);
							}
							else{Res_Obj = 404;}
						}
						else if(LINK[2]=='services')
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))
							{// Show RTU/RTUID/services
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1services;
									Res_Obj = JSON.parse(temp);
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7services;
									Res_Obj = JSON.parse(temp);
								}
								else
								{
									var temp = ROBAllservices.replace(/ROB/gi,LINK[1]);;
									Res_Obj = JSON.parse(temp);
								}
							}
							else if(LINK.length == 4||(LINK.length == 5 && LINK[4] == 'info'))
							{
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1services;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;	
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7services;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = ROBAllservices.replace(/ROB/gi,LINK[1]);
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length==5 && LINK[4]=='notifs')
							{
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1services;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_ServicesNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = ROB_ServicesNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;	
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7services;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = ROBAllservices.replace(/ROB/gi,LINK[1]);
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										temp1 = JSON.parse(temp).children[LINK[3]];
										temp1.count = 0;
										temp1.lastRun = 0;
										Res_Obj = temp1;
									} 
									else{Res_Obj = 404;}
								}
							}
						}
						else if(LINK[2]=='events')
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))
							{// Show RTU/RTUID/events
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1events;
									Res_Obj = JSON.parse(temp);
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7events;
									Res_Obj = JSON.parse(temp);
								}
								else
								{
									var temp = ROBAllevents.replace(/ROB/gi,LINK[1]);
									Res_Obj = JSON.parse(temp);
								}
							}
							else if(LINK.length == 4)
							{
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp = ROB_eventsPayload;
										temp.id = LINK[3];
										temp.senderID = LINK[1];
										Res_Obj = temp;
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp = ROB_eventsPayload;
										temp.id = LINK[3];
										temp.senderID = LINK[1];
										Res_Obj = temp;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = ROBAllevents.replace(/ROB/gi,LINK[1]);
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp = ROB_eventsPayload;
										temp.id = LINK[3];
										temp.senderID = LINK[1];
										Res_Obj = temp;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length == 5 && LINK[4] == 'info') // add id for eventrs notifs
							{
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var temp = ROBAllevents.replace(/ROB/gi,LINK[1]);
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length == 5 && LINK[4] == 'notifs') // add id for eventrs notifs
							{
								if(LINK[1]=='ROB1')
								{
									var temp = ROB1events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
										var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											if(ROB_EventsNotifs[temp][keys[i]].eventID == LINK[3])
											{
												temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
											}
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else if(LINK[1]=='ROB7')
								{
									var temp = ROB7events;
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
										var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											if(ROB_EventsNotifs[temp][keys[i]].eventID == LINK[3])
											{
												temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
											}
											
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
								else
								{
									var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
									var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
									var temp = ROBAllevents.replace(/ROB/gi,LINK[1]);
									var temp1 = JSON.parse(temp).children;
									var KEYS = Object.keys(temp1).toString().split(",");
									if(KEYS.indexOf(LINK[3])!=-1)
									{
										var temp2 = temp1[LINK[3]];
										var temp = parseInt(LINK[1].substring(3))-1;
										var keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
										for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
										{
											if(ROB_EventsNotifs[temp][keys[i]].eventID == LINK[3])
											{
												temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
											}
											
										}
										Res_Obj = temp2;
									} 
									else{Res_Obj = 404;}
								}
							}
							else if(LINK.length == 6 && LINK[4] == 'notifs')
							{
								var notifsList = ROB_EventsNotifs[parseInt(LINK[1].substring(3))-1];
								var keys = Object.keys(notifsList).toString().split(",");
								if(keys.indexOf(LINK[5])!=-1)
								{
									var temp = notifsList[LINK[5]];
									Res_Obj = temp;
								}
								else{Res_Obj = 404;}
							}
							
							else{Res_Obj = 404;}
						}
						else
						{
							if(LINK.length == 3 || (LINK.length==4 && LINK[3]=='info'))							
							{// Show RTU/RTUID/notifs
								
								var RTUnotifs_temp=RTUnotifs.replace(/notifsID/gi,LINK[3]);
								var temp2 = JSON.parse(RTUnotifs_temp.replace(/RTUID/gi,LINK[1]));
								temp = parseInt(LINK[1].substring(3))-1;
								var keys = Object.keys(ROB_ServicesNotifs[temp]).toString().split(",");
								for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
								{
									temp2.children[keys[i]] = ROB_ServicesNotifs[temp][keys[i]];
								}
								keys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
								for(var i = 0;(i<keys.length)&&(keys[0]!='');i++)
								{
									temp2.children[keys[i]] = ROB_EventsNotifs[temp][keys[i]];
								}
								Res_Obj = temp2;
							}
							else if(LINK.length == 4 || (LINK.length==5 && LINK[4]=='info'))
							{
								var temp = parseInt(LINK[1].substring(3))-1;
								var servkeys = Object.keys(ROB_ServicesNotifs[temp]).toString().split(",");
								var Evenkeys = Object.keys(ROB_EventsNotifs[temp]).toString().split(",");
								if(servkeys.indexOf(LINK[3])!=-1)
								{
									Res_Obj = ROB_ServicesNotifs[temp][LINK[3]]
								}
								else if(Evenkeys.indexOf(LINK[3])!=-1)
								{
									Res_Obj = ROB_EventsNotifs[temp][LINK[3]]
								}
								else{Res_Obj = 404;}
							}
						}
					}
					else{Res_Obj = 404;}
				}
			
			}
		}
	}
	if(Res_Obj == 404)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 404;
		ErrorTemplate.status="error"
		ErrorTemplate.message = "Not Found"
		Res_Obj = ErrorTemplate;
		res.status(404).send(Res_Obj);
		res.end();
	}
	else
	{
		res.send(Res_Obj);
		res.end();
	} 
});

router.post('/*',function(req, res, next){
	var RES;
	console.log("the request body : \n"+JSON.stringify(req.body))
	console.log("All Req : \n" + req)
	switch(req.originalUrl)
	{
		case '/RTU/reset':
			var Args={Process:'ResetSim',destURL:req.body.destUrl};
			io.emit('Process', Args);
			CNV_ServicesNotifs = [{},{},{},{},{},{},{},{},{},{},{},{}];
			CNV_EventsNotifs = 	 [{},{},{},{},{},{},{},{},{},{},{},{}];
			ROB_ServicesNotifs = [{},{},{},{},{},{},{},{},{},{},{},{}];
			ROB_EventsNotifs = 	 [{},{},{},{},{},{},{},{},{},{},{},{}];
			CNV_Queue =[{"TZ12":"0","TZ23":"0","TZ35":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ23":"0","TZ35":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"},
						{"TZ12":"0","TZ23":"0","TZ14":"0","TZ35":"0","TZ45":"0"}];
			ServicesNotifsCount = 0;
			EventsNotifsCount = 0;
			PenColor = ['RED','RED','RED','RED','RED','RED','RED','RED','RED','RED','RED','RED'];				
			RTU_Zones = [{"Z1":-1,"Z2":-1,"Z3":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z2":-1,"Z3":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1},
						{"Z1":-1,"Z2":-1,"Z3":-1,"Z4":-1,"Z5":-1}]
			RES = 202;
			break;
		default:
		////console.log(RTU_Zones)
			var OrginalURL = req.originalUrl;
			var LINK = OrginalURL.split("/");
			var ReqLink = '';
			for (var i =0; i< LINK.length ; i++)
			{
				if(LINK[i] == '')
				{
					LINK.splice(i,1);
				}
			}
			if(LINK[0] == 'RTU')
			{
				if(LINK[1].indexOf('CNV') !=-1)
				{
					if(LINK[2]=='services')
					{
						if(LINK.length == 4)
						{
							if(LINK[1]=='CNV1')
							{
								if(LINK[3].substring(0,LINK[3].length-2)=='TransZone')
								{
									var FromZone = LINK[3].substring(LINK[3].length-2,LINK[3].length-1);
									var ToZone = LINK[3].substring(LINK[3].length-1);
									if(RTU_Zones[0]["Z"+ToZone]== -1 && RTU_Zones[0]["Z"+FromZone]!= -1 )
									{
										var Args = {WS:'1',Process:'TransZone'};
										Args.FromZone = FromZone; 
										Args.ToZone = ToZone;
										Args.PalletID = RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+FromZone];
										var BodyKeys = Object.keys(req.body).toString().split(",");
										if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
										else{Args.destURL = ""}
										if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
										else{Args.clientData = ""}
										io.emit('Process', Args);
										RES = 202
									}
									else if(CNV_Queue[0]["TZ"+FromZone+ToZone] == "0" && RTU_Zones[0]["Z"+FromZone]!= -1 )
									{
										CNV_Queue[0]["TZ"+FromZone+ToZone] = req.body.destUrl;
										RES = 202
									}
									else{RES = 403}
								}
								else if(LINK[3]== 'Z1' ||LINK[3]== 'Z2' ||LINK[3]== 'Z3' ||LINK[3]== 'Z5')
								{
									var zoneNum = LINK[3].substring(1);
									var temp = {PalletID : String(RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+zoneNum])};
									res.json(temp);
									RES =0
								}
								else{RES = 404}
							}
							else if(LINK[1]=='CNV7')
							{
								if(LINK[3].substring(0,LINK[3].length-2)=='TransZone')
								{
									var FromZone = LINK[3].substring(LINK[3].length-2,LINK[3].length-1);
									var ToZone = LINK[3].substring(LINK[3].length-1);
									if(RTU_Zones[6]["Z"+ToZone]== -1 && RTU_Zones[6]["Z"+FromZone]!= -1 )
									{
										var Args = {WS:'7',Process:'TransZone'};
										Args.FromZone = FromZone; 
										Args.ToZone = ToZone;
										Args.PalletID =  RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+FromZone];
										var BodyKeys = Object.keys(req.body).toString().split(",");
										if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
										else{Args.destURL = ""}
										if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
										else{Args.clientData = ""}
										io.emit('Process', Args);
										RES = 202
									}
									else if(CNV_Queue[6]["TZ"+FromZone+ToZone] == "0" && RTU_Zones[6]["Z"+FromZone]!= -1 )
									{
										CNV_Queue[6]["TZ"+FromZone+ToZone] = req.body.destUrl;
										RES = 202
									}
									else{
										RES = 403}
								}
								else if(LINK[3] == 'Z2'|| LINK[3] == 'Z3' || LINK[3] == 'Z5')
								{
									var zoneNum = LINK[3].substring(1);
									var temp = {PalletID : String(RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+zoneNum])};
									res.json(temp);
									RES =0
								}
								else{RES = 404}
							}
							else if(LINK[1]== 'CNV2' || LINK[1]== 'CNV3' || LINK[1]== 'CNV4' || LINK[1]== 'CNV5' || LINK[1]== 'CNV6' || LINK[1]== 'CNV8' || LINK[1]== 'CNV9' || LINK[1]== 'CNV10' || LINK[1]== 'CNV11' || LINK[1]== 'CNV12')
							{
								
								if(LINK[3].substring(0,LINK[3].length-2)=='TransZone')
								{
									var FromZone = LINK[3].substring(LINK[3].length-2,LINK[3].length-1);
									var ToZone = LINK[3].substring(LINK[3].length-1);
									if(RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+ToZone]== -1 && RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+FromZone]!= -1 )
									{
										var Args = {WS:LINK[1].substring(3),Process:'TransZone'};
										Args.FromZone = FromZone;
										Args.ToZone = ToZone
										Args.PalletID =  RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+FromZone];
										var BodyKeys = Object.keys(req.body).toString().split(",");
										if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
										else{Args.destURL = ""}
										if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
										else{Args.clientData = ""}
										io.emit('Process', Args);
										RES = 202;
									}
									else if(CNV_Queue[parseInt(LINK[1].substring(3))-1]["TZ"+FromZone+ToZone] == "0" && RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+FromZone]!= -1 )
									{
										CNV_Queue[parseInt(LINK[1].substring(3))-1]["TZ"+FromZone+ToZone] = req.body.destUrl;
										RES = 202
									}
									else{RES = 403}
								}
								else if(LINK[3]== 'Z1' ||LINK[3]== 'Z2' ||LINK[3]== 'Z3' ||LINK[3]== 'Z4'||LINK[3]== 'Z5')
								{
									var zoneNum = LINK[3].substring(1);
									var temp = {PalletID : String(RTU_Zones[parseInt(LINK[1].substring(3))-1]["Z"+zoneNum])};
									res.json(temp);
									RES =0
								}
								else{RES = 404}
							}
							else{RES = 404}
						}
						else if(LINK.length = 5 && LINK[4] == 'notifs')
						{
							if(LINK[1]=='CNV1')
							{
								if(LINK[3]=='TransZone')
								{}
								else if(LINK[3]=='Z1')
								{}
								else if(LINK[3]=='Z2')
								{}
								else if(LINK[3]=='Z3')
								{}
								else if(LINK[3]=='Z5')
								{}
								else{RES = 404}
							}
							else if(LINK[1]=='CNV7')
							{
								if(LINK[3]=='TransZone')
								{}
								else if(LINK[3]=='Z2')
								{}
								else if(LINK[3]=='Z3')
								{}
								else if(LINK[3]=='Z5')
								{}
								else{RES = 404}
							}
							else if(LINK[1]== 'CNV2' || LINK[1]== 'CNV3' || LINK[1]== 'CNV4' || LINK[1]== 'CNV5' || LINK[1]== 'CNV6' || LINK[1]== 'CNV8' || LINK[1]== 'CNV9' || LINK[1]== 'CNV10' || LINK[1]== 'CNV11' || LINK[1]== 'CNV12')
							{
								if(LINK[3]=='TransZone')
								{}
								else if(LINK[3]=='Z2')
								{}
								else if(LINK[3]=='Z3')
								{}
								else if(LINK[3]=='Z5')
								{}
								else{RES = 404}
							}
							else{RES = 404}
						}
						else{RES = 404}
					}
					else if(LINK[2]=='events')
					{
						if(LINK.length == 5 && LINK[4] == 'notifs')
						{
							if(LINK[1]=='CNV1')
							{
								if(LINK[3]=='Z1_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez1"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self:Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='Z2_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez2"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self:Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='Z3_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez3"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self:Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='Z5_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez5"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else{RES = 404}
							}
							else if(LINK[1]=='CNV7')
							{
								if(LINK[3]=='Z2_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez2"+String(EventsNotifsCount);
									var temp = {};			
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else if(LINK[3]=='Z3_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez3"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else if(LINK[3]=='Z5_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez5"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else{RES = 404}
							}
							else if(LINK[1]== 'CNV2' || LINK[1]== 'CNV3' || LINK[1]== 'CNV4' || LINK[1]== 'CNV5' || LINK[1]== 'CNV6' || LINK[1]== 'CNV8' || LINK[1]== 'CNV9' || LINK[1]== 'CNV10' || LINK[1]== 'CNV11' || LINK[1]== 'CNV12')
							{
								if(LINK[3]=='Z1_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez1"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else if(LINK[3]=='Z2_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez2"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else if(LINK[3]=='Z3_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez3"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else if(LINK[3]=='Z4_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez4"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else if(LINK[3]=='Z5_Changed')
								{
									EventsNotifsCount++;
									var tempname = "nez5"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0}
								else{RES = 404}
							}
							else{RES = 404}
						}
						else{RES = 404}
					}
					else if(LINK[2] == 'data')
					{RES = 501}	
					else if(LINK[2]== 'notifs')
					{RES = 501}						
					else{RES = 404}
				}
				else if(LINK[1].indexOf('ROB') !=-1)
				{
					if(LINK[2]=='services')
					{
						if(LINK.length == 4)
						{
							if(LINK[1]=='ROB1')
							{
								if(LINK[3]=='LoadPaper')
								{
									var Args = {WS:'1',Process:LINK[3]}; 
									Args.PalletID = req.body.PalletID;
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202
								}
								else if(LINK[3]=='UnloadPaper')
								{
									var Args = {WS:'1',Process:LINK[3]}; 
									Args.PalletID = req.body.PalletID;
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202
								}
								else{RES = 404}
							}
							else if(LINK[1]=='ROB7')
							{
								if(LINK[3]=='LoadPallet')
								{
									var Args = {WS:'1',Process:LINK[3]}; 
									Args.PalletID = req.body.PalletID;
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202
								}
								else if(LINK[3]=='UnloadPallet')
								{
									var Args = {WS:'1',Process:LINK[3]}; 
									Args.PalletID = req.body.PalletID;
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202
								}
								else{RES = 404}
							}
							else if(LINK[1]== 'ROB2' || LINK[1]== 'ROB3' || LINK[1]== 'ROB4' || LINK[1]== 'ROB5' || LINK[1]== 'ROB6' || LINK[1]== 'ROB8' || LINK[1]== 'ROB9' || LINK[1]== 'ROB10' || LINK[1]== 'ROB11' || LINK[1]== 'ROB12')
							{
								if(LINK[3]=='ChangePenRED')
								{
									PenColor[LINK[1].substring(3)-1] = 'RED';
									var Args = {WS:LINK[1].substring(3),Process:LINK[3]};
									Args.Color = 'RED';
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202
									
								}
								else if(LINK[3]=='ChangePenGREEN')
								{
									PenColor[LINK[1].substring(3)-1] = 'GREEN';
									var Args = {WS:LINK[1].substring(3),Process:LINK[3]};
									Args.Color = 'GREEN';
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202;
								}
								else if(LINK[3]=='GetPenColor')
								{
									var color = PenColor[parseInt(LINK[1].substring(3))-1];
									var Resp = {CurrentPen:color};
									res.json(Resp);
									RES = 0;
								}
								else if(LINK[3]=='ChangePenBLUE')
								{
									PenColor[LINK[1].substring(3)-1] = 'BLUE';
									var Args = {WS:LINK[1].substring(3),Process:LINK[3]};
									Args.Color = 'BLUE';
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202;
								}
								else if(LINK[3]=='Draw1' ||LINK[3]=='Draw2' ||LINK[3]=='Draw3' ||LINK[3]=='Draw4' ||LINK[3]=='Draw5' ||LINK[3]=='Draw6' ||LINK[3]=='Draw7' ||LINK[3]=='Draw8' ||LINK[3]=='Draw9')
								{
									var Args = {WS:LINK[1].substring(3),Process:'Draw'}; 
									Args.PalletID = req.body.PalletID;
									switch(PenColor[LINK[1].substring(3)-1])
									{
										case'RED':
											Args.Color = 1;
										break;
										case'GREEN':
											Args.Color = 2;
										break;
										case'BLUE':
											Args.Color = 3;
										break;
									}
									
									var Recipe = LINK[3].substring(4);
									if(Recipe == '1'||Recipe == '2'||Recipe == '3'){Args.OP = 1}
									else if(Recipe == '4'||Recipe == '5'||Recipe == '6'){Args.OP = 2}
									else if(Recipe == '7'||Recipe == '8'||Recipe == '9'){Args.OP = 3}
									Args.Recipe = Recipe;
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){Args.destURL = req.body.destUrl;}
									else{Args.destURL = ""}
									if(BodyKeys.indexOf("clientData") !=-1){Args.clientData = req.body.clientData;}
									else{Args.clientData = ""}
									io.emit('Process', Args);
									RES = 202
								}
								else{RES = 404}
							}
							else{RES = 404}
						}
						else if(LINK.length = 5 && LINK[4] == 'notifs')
						{
							
						}
						else{RES = 404}
					}
					else if(LINK[2]=='events')
					{
						if(LINK.length == 5 && LINK[4] == 'notifs')
						{
							if(LINK[1]=='ROB1')
							{
								if(LINK[3]=='PaperLoaded')
								{
									EventsNotifsCount++;
									var tempname = "nepl"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='PaperUnloaded')
								{
									EventsNotifsCount++;
									var tempname = "nepu"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else{RES = 404}
							}
							else if(LINK[1]=='ROB7')
							{
								if(LINK[3]=='PalletLoaded')
								{
									EventsNotifsCount++;
									var tempname = "nepl"+String(EventsNotifsCount);
									var temp = {};			
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='PalletUnloaded')
								{
									EventsNotifsCount++;
									var tempname = "nepu"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else{RES = 404}
							}
							else if(LINK[1]== 'ROB2' || LINK[1]== 'ROB3' || LINK[1]== 'ROB4' || LINK[1]== 'ROB5' || LINK[1]== 'ROB6' || LINK[1]== 'ROB8' || LINK[1]== 'ROB9' || LINK[1]== 'ROB10' || LINK[1]== 'ROB11' || LINK[1]== 'ROB12')
							{
								if(LINK[3]=='PenChanged')
								{
									EventsNotifsCount++;
									var tempname = "nepc"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='DrawStartExecution')
								{
									EventsNotifsCount++;
									var tempname = "nedse"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='DrawEndExecution')
								{
									EventsNotifsCount++;
									var tempname = "nedee"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='LowInkLevel')
								{
									EventsNotifsCount++;
									var tempname = "nelil"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else if(LINK[3]=='OutOfInk')
								{
									EventsNotifsCount++;
									var tempname = "neooi"+String(EventsNotifsCount);
									var temp = {};			//"nz1":{"id":"id1","links":{self: ""},"class":""}};	
									temp.id = tempname;
									temp.links = {self: Configuration.Host+":"+Configuration.Port+"/"+LINK[0]+"/"+LINK[1]+"/"+LINK[2]+"/"+LINK[3]+"/"+LINK[4]+"/"+tempname};
									temp.class = "eventNotification";
									temp.eventID = LINK[3];
									var BodyKeys = Object.keys(req.body).toString().split(",");
									if(BodyKeys.indexOf("destUrl") !=-1){temp.destUrl = req.body.destUrl;}
									else{temp.destUrl = ""}
									if(BodyKeys.indexOf("clientData") !=-1){temp.clientData = req.body.clientData;}
									else{temp.clientData = ""}
									var temp1 = {};
									temp1[tempname] = temp;
									ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][tempname] = temp;
									res.json(temp1)
									RES =0
								}
								else{RES = 404}
							}
							else{RES = 404}
						}
						else{RES = 404}
					}
					else if(LINK[2] == 'data')
					{RES = 501}	
					else if(LINK[2]== 'notifs')
					{RES = 501}						
					else{RES = 404}
				}
				else{RES = 404}
				
			}
			else{RES = 404}
			break;
			
	} 


	

	var d = new Date();
	var eventBody={id:"ServiceInvoked", senderID:"FASTorySimulator",lastEmit:d.getTime(),payload:{ServiceURL:req.originalUrl, Requester: req.connection.remoteAddress,Method:"POST", ServiceStatus:RES}};
	var args = {data: eventBody,headers:{"Content-Type": "application/json"}};
	client.post("http://127.0.0.1:3100/data/event-listener", args, function(data,response){});

	if(RES == 0)
	{
		res.end();
	}
	if(RES == 202)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 202;
		ErrorTemplate.status="Accepted"
		ErrorTemplate.message = "Services is accepted"
		Res_Obj = ErrorTemplate;
		res.set('Content-Type', 'application/json');
		res.status(202).send(Res_Obj);
		res.end();
	}
	else if(RES == 403)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 403;
		ErrorTemplate.status="Forbidden"
		ErrorTemplate.message = "Services is not allowed now"
		Res_Obj = ErrorTemplate;
		res.status(403).send(Res_Obj);
		res.end();
	}
	else if(RES == 404)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 404;
		ErrorTemplate.status="Not found"
		ErrorTemplate.message = "Services is not found"
		Res_Obj = ErrorTemplate;
		res.status(404).send(Res_Obj);
		res.end();
	}	
	else if(RES == 501)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 501;
		ErrorTemplate.status="Not Implemented"
		ErrorTemplate.message = "Services is not Implemented"
		Res_Obj = ErrorTemplate;
		res.status(501).send(Res_Obj);
		res.end();
	}
});

router.put('/*',function(req, res, next){
	var ErrorTemplate = errorTemplate;
	ErrorTemplate.code = 501;
	ErrorTemplate.status="Not Implemented"
	ErrorTemplate.message = "Services is not Implemented"
	Res_Obj = ErrorTemplate;
	res.status(501).send(Res_Obj);
	res.end();
}); 

router.delete('/*',function(req, res, next){
// RTU/{RTUID}/events/{eventID}/notifs/{notifsID}
	var resCode;
	var OrginalURL = req.originalUrl;
	var LINK = OrginalURL.split("/");
	for (var i =0; i< LINK.length ; i++)
	{
		if(LINK[i] == '')
		{
			LINK.splice(i,1);
		}
	}
	var temp = RTU_Main.children;
	var KEYS = Object.keys(temp).toString().split(",");
	if(LINK[0] == 'RTU' && KEYS.indexOf(LINK[1])!=-1 && LINK[2] == 'events' && LINK[4] == 'notifs' && LINK.length == 6)
	{
		if(LINK[1].indexOf('CNV')!=-1) // CNV
		{
			var CNV_EventsNotifs_Obj = CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)]
			var KEYS = Object.keys(CNV_EventsNotifs_Obj).toString().split(",");
			if(KEYS.indexOf(LINK[5])!=-1 && CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][LINK[5]].eventID == LINK[3])
			{
				delete CNV_EventsNotifs[parseInt(LINK[1].substring(3)-1)][LINK[5]];
				resCode = 202;
			}
			else{resCode = 404;}
		}
		else							// ROB
		{		
			var ROB_EventsNotifs_Obj = ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)]
			var KEYS = Object.keys(ROB_EventsNotifs_Obj).toString().split(",");
			if(KEYS.indexOf(LINK[5])!=-1 && ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][LINK[5]].eventID == LINK[3])
			{
				delete ROB_EventsNotifs[parseInt(LINK[1].substring(3)-1)][LINK[5]];
				resCode = 202;			
			}
			else{resCode = 404;}
		}
	}
	else
	{resCode = 501;}
	
	if(resCode == 202)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 202;
		ErrorTemplate.status="Accepted"
		ErrorTemplate.message = "Services is accepted"
		Res_Obj = ErrorTemplate;
		res.status(202).send(Res_Obj);
		res.end();
	}
	else if(resCode == 404)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 404;
		ErrorTemplate.status="Not found"
		ErrorTemplate.message = "Services is not found"
		Res_Obj = ErrorTemplate;
		res.status(404).send(Res_Obj);
		res.end();
	}
	else if(resCode == 501)
	{
		var ErrorTemplate = errorTemplate;
		ErrorTemplate.code = 501;
		ErrorTemplate.status="Not Implemented"
		ErrorTemplate.message = "Services is not Implemented"
		Res_Obj = ErrorTemplate;
		res.status(501).send(Res_Obj);
		res.end();
	}
});

module.exports = router;

