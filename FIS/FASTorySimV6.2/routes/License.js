var express = require('express');
var router = express.Router();
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
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('License', { title: 'License Agreement' ,HostName : Configuration.Host+':'+Configuration.Port});
});

module.exports = router;