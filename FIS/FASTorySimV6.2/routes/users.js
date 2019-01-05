var express = require('express');
var router = express.Router(); 
var Client = require('node-rest-client').Client;
var client = new Client();
var fs = require('fs');
var Configuration={};
var events = require('events');
var eventEmitter = new events.EventEmitter();
fs.readFile('public/Configuration.json', 'utf8', function(err,data) {
		Configuration = JSON.parse(data); 
		eventEmitter.emit('Intialization');
 });
eventEmitter.on('Intialization', function(){
	
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(req.query.url)
	var RTU_URL = req.query.url
	client.get(RTU_URL.toString(),{},function(data,response){
		res.render('users', { title: 'RTUs',test:(data.toString()),baseUrl:RTU_URL,HostName : Configuration.Host+':'+Configuration.Port});
	});
});

module.exports = router;
