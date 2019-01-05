//   Factory Information Systems: Course Assignment
//      Main server,  InfSystem.js
// Http post and XML is used for communication between main server and archiver

var express = require('express');
var app = express();
var request = require('request');           // http post
var bodyParser = require('body-parser');
var XMLWriter = require('xml-writer');
var validator = require('xsd-schema-validator');
var moment = require('moment');                     // time
var xml2js = require('xml2js');
var parseXML = require('xml2js').parseString;       // Json --> XML

            // XML --> Json

var port = 4444;                // server running on http://localhost:4444
var QueryRes, productionJSON, orderInProduction;
var productionXML = "";
var productionStarted = false;  // production started
var phones = [];                // phones to production, (class Phone used for each item)

app.use(bodyParser.json());
app.use(bodyParser.text({type: 'text/xml'}));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');                          // ejs files used for views (UI)

app.get('/', function (req, res) {
    res.render('index');              // Home page
});

app.post('/', function (req, res) {
    res.end();
});
// place an order page: http://localhost:4444/order
app.get('/order', function (req, res) {
    res.render('placeOrder');
});

// New order from UI
app.post('/order',function (req, res) {
    var XML = XMLbuilder.buildObject(req.body);     //convert 'JSON' order to XML

    var URL = 'http://localhost:4445/newOrder';     // archiver address
    sendMessage(URL, XML);                          //send order to Archiver
    res.render('viewOrder', {data: req.body});      // view inserted order details
});

// Database query from UI
app.post('/dbQueryPost', function (req, res) {
    QueryRes = "";      // query result from DB

    var XML = XMLbuilder.buildObject(req.body);      // convert inserted query to XML
    var URL = 'http://localhost:4445/DBquery';
    sendMessage(URL, XML);                          //send order to Archiver

    // show DB query results
    setTimeout(function () {
        res.render('DBqueryRes', {data: QueryRes});     //display query results in UI
    }, 300);

});

// DB Query UI,  http://localhost:4444/DBquery
app.get('/dbQuery', function (req, res) {
    res.render('mysqlquery');               // view
});

//Database query response from Archiver
app.post('/dbQuery', function (req, res) {
    QueryRes = req.body.toString().split('\n');     // split query result XML from line breaks
    res.end('Acknowledge');
});

// ADD product to order UI,  http://localhost:4444/addProduct
app.get('/addProduct', function (req, res) {
    res.render('addProduct');
});

// new product inserted in UI
app.post('/addProduct', function (req, res) {
    //convert 'JSON' order to XML
    var XML = XMLbuilder.buildObject(req.body);

    var URL = 'http://localhost:4445/addProduct';
    sendMessage(URL, XML);                          //send product to Archiver
    res.render('viewNewProduct', {data: req.body}); // view inserted product details
});

// Make order request from UI
app.post('/startProduction', function (req, res) {

    if (productionStarted == false) {       // if production already started cannot start new order production
        phones = [];                        // empty previous order details
        orderInProduction = req.body.orderId;           // order ID to production
        var XML = XMLbuilder.buildObject(req.body);
        var URL = 'http://localhost:4445/production';
        sendMessage(URL, XML);                          //send production call to Archiver

        // view order details
        setTimeout(function () {
            var XML1;
            if (productionXML != "") {          // Order not exist if var is empty
                parseXML(productionXML, function (err, result) {     // result == 'JSON'
                    if (err) throw err;
                    XML1 = XMLbuilder.buildObject(result);
                });
                XML1 = XML1.split('\n');
                res.render('orderToProduction', {data: XML1});      // display order details in UI
            }
            else {
                res.render('index');        // order not exist show home page
            }
        }, 1000);       // wait for response from archiver

    }
    else {
        console.log("Process is busy, order in production");
        res.render('index');
    }
});

// production XML from archiver
app.post('/productionInf', function (req, res) {
    productionXML = req.body;       // Archiver builds XML of the order which goes to production

    parseXML(req.body, function (err, result) {     // result == 'JSON'
        if (err) throw err;
        productionJSON = result.Products.Phone;     // order information, different products in array
        //console.log(productionJSON);
        phonesList();  // build array of phones using Phone class
    });
    productionStarted = true;       // start production
    res.end('Acknowledge');
});

//receive notification from process
app.post('/notifs', function (req, res) {
    console.log(req.body);

    // if order in production update status
    if (productionStarted && req.body.payload.PalletID != -1) {
        updateProductionStatus(req.body);
    }
    res.render('productionState', {data: phones});      // view order status in UI: http://localhost:4444/notifs
});

// view order status in UI: http://localhost:4444/notifs
app.get('/notifs', function (req, res) {
    res.render('productionState', {data: phones});     // status information
});

app.post('/stopProduction', function (req, res) {
    productionStarted = false;      // new Order can be sent to process
    res.render('index');
});

subscribeEvents();      // subscribe to events

// server: http://localhost:4444/
app.listen(port, function () {
    console.log('Server is running on http://localhost:' + port);
});

// send HTTP post: XML
function sendMessage(URI, message) {

    var options = {
        method: 'post',
        body: message,
        url: URI,
        headers: {
            'Content-Type': 'text/xml'
        }
    };
    request(options, function (err, res, body) {
        if (err) {
            console.log('Error :', err);
            return;
        }
    });
}

//subscribe Fastory events
function subscribeEvents() {

    for (var WsNumber = 1; WsNumber < 13; WsNumber++) {

        request.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z1_Changed/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
        });
        request.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z2_Changed/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
        });
        request.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z3_Changed/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
        });
        request.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z4_Changed/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
        });
        //request.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z5_Changed/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
        //});
        if (WsNumber == 2 || WsNumber == 3 || WsNumber == 4 || WsNumber == 5 || WsNumber == 6 || WsNumber == 8 || WsNumber == 9 || WsNumber == 10 || WsNumber == 11 || WsNumber == 12) {

            //  request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawStartExecution/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
            //  });
            request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawEndExecution/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
            });
            //   request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/PenChanged/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
            //   });
        }
    }

    request.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
    });
    request.post('http://localhost:3000/RTU/SimROB1/events/PaperUnloaded/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
    });
    request.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
    });
    request.post('http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
    });
}

// Phone Class is used for monitoring order status
// product information
function Phone(ft, fc, st, sc, kt, kc) {
    // always initialize all instance properties
    this.id = '';
    this.location = '';             // phone location in production system
    this.frametype = ft;            // ordered frame
    this.framecolor = fc;
    this.screentype = st;
    this.screencolor = sc;
    this.keyboardtype = kt;
    this.keyboardcolor = kc;
    this.frame = '';                // built frame
    this.screen = '';
    this.keyboard = '';
    this.phoneready = false;
    this.prodStartTime = '';
    this.prodEndTime = '';

}
// class methods

Phone.prototype.productState = function () {
    return "Frame ready: " + this.frame + ", Screen ready: " + this.screen + ", Keyboard ready: " + this.keyboard;
};
Phone.prototype.productInfo = function () {
    return "Frame: [" + this.frametype + ", " + this.framecolor + "]; Screen: [" + this.screentype + ", " + this.screencolor + "]; Keyboard: [" + this.keyboardtype + ", " + this.keyboardcolor + "]";
};

// make list of phones which goes to production
function phonesList() {

    for (var i = 0; i < productionJSON.length; i++) {
        var amount = productionJSON[i].Quantity;        // how many corresponding phones is ordered
        for (var j = 0; j < amount; j++) {              // each phone ordered should have own instance;  push to phones array
            phones.push(new Phone(productionJSON[i].FrameType, productionJSON[i].FrameColor, productionJSON[i].ScreenType, productionJSON[i].ScreenColor, productionJSON[i].KeyboardType, productionJSON[i].KeyboardColor));
        }
    }
}
// update production status, can be monitored from UI
function updateProductionStatus(notif) {    // analyse notification message
    var Pid;                                // pallet id
    if (notif.payload.hasOwnProperty('PalletID')) {       // pallet id exist in payload
        Pid = notif.payload.PalletID;                   // store pallet id


        // new pallet loaded, save pallet id
        if (notif.id == 'PalletLoaded') {
            for (var i = 0; i < phones.length; i++) {
                if (phones[i].id == '') {       // no id yet
                    phones[i].id = Pid;         // give pallet id to next phone
                    phones[i].prodStartTime = moment().format('YYYY-M-DD HH:mm:ss');
                    break;                  // empty id found break for loop
                }
            }
        }
        // update pallet position
        else if (notif.id == 'Z1_Changed' || notif.id == 'Z2_Changed' || notif.id == 'Z3_Changed' || notif.id == 'Z4_Changed') {
            for (var i = 0; i < phones.length; i++) {
                if (phones[i].id == Pid) {                  // correct id
                    phones[i].location = notif.senderID + ", zone" + notif.id.toString().substr(1, 1);     // store pallet location
                    break;      // break for loop
                }
            }
        }       // part finished update phone information to phones array
        else if (notif.id == 'DrawEndExecution') {
            for (var i = 0; i < phones.length; i++) {
                if (phones[i].id == Pid) {
                    var typeNbr = 0;        // convert recipe number

                    // frame built, update information
                    if (notif.payload.Recipe == '1' || notif.payload.Recipe == '2' || notif.payload.Recipe == '3') {
                        if (phones[i].frame == '') {        // no frame, build frame
                            phones[i].frame = 'frame' + notif.payload.Recipe + ', ' + notif.payload.Color.toString().toLowerCase();      // store information in array
                        }
                        break;
                    }           // screen built, update information
                    else if (notif.payload.Recipe == '4' || notif.payload.Recipe == '5' || notif.payload.Recipe == '6') {
                        if (phones[i].screen == '') {
                            if (notif.payload.Recipe == '4') {      // convert recipe number to type number
                                typeNbr = 1;
                            } else if (notif.payload.Recipe == '5') {
                                typeNbr = 2;
                            } else {
                                typeNbr = 3;
                            }
                            phones[i].screen = 'screen' + typeNbr + ', ' + notif.payload.Color.toString().toLowerCase();     // store information in array
                        }
                        break;
                    }           // keyboard built, update information
                    else if (notif.payload.Recipe == '7' || notif.payload.Recipe == '8' || notif.payload.Recipe == '9') {
                        if (phones[i].keyboard == '') {
                            if (notif.payload.Recipe == '7') {
                                typeNbr = 1;
                            } else if (notif.payload.Recipe == '8') {
                                typeNbr = 2;
                            } else {
                                typeNbr = 3;
                            }
                            phones[i].keyboard = 'keyboard' + typeNbr + ', ' + notif.payload.Color.toString().toLowerCase();     // store information in array
                        }
                        break;
                    }
                }
            }
        }
    }
    // check if phones are ready
    for (var i = 0; i < phones.length; i++) {
        if (phones[i].phoneready == false) {
            if (phones[i].frame != '' && phones[i].screen != '' && phones[i].keyboard != '') {
                phones[i].phoneready = true;
                phones[i].prodEndTime = moment().format('YYYY-M-DD HH:mm:ss');
            }
        }
    }
}

// export the class
//Phone.exports = Phone;


function validateXMl(xml) {

    var schema = 'schema.xsd';

    var validXML = false;

    //check existence of schema file
    try {
        fs.accessSync(schema, fs.F_OK);
    } catch (e) {
        console.log('XSD file is not accessible.');
        console.log(e);
    }

    //validate xml
    validator.validateXML(xml, schema, function (err, result) {
        if (err) {
            console.log('Error was found during validation of XML file');
            console.log(err);
        }
        console.log('XML file is valid: ' + result.valid); // IS XML-file valid
        validXML = result.valid;                              // save result
    });
}