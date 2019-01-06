//   Factory Information Systems: Course Assignment
//      Archiver

//  Archiver handles database functions and replies to Main server using http post and XML

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var moment = require('moment');
var XMLWriter = require('xml-writer');
var xml2js = require('xml2js');
var parseXML = require('xml2js').parseString;
var XMLbuilder = new xml2js.Builder();
var mysql = require('mysql');               // MYSQL database

var result, customerId, productId, orderIdExist;

// MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, //Port number to connect to for the DB.
    user: 'root', //The user name you have assigned to work with the database.
    password: 'yuanqi1011', //The password you have assigned
    database: 'fisdb' //The database you would like to connect.
});
connection.connect();       // database connection

// server runs on: localhost:4445
var portNbr = '4445';   // No user interface only handles requests from the main server

app.use(bodyParser.json());
app.use(bodyParser.text({type: 'text/xml'}));
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', function (req, res) {
    res.end('Archiver');
});
// New order request from MAIN server
app.post('/newOrder', function (req, res) {

    //console.log(req.body);

    // XML to JSON: req.body --> result
    parseXML(req.body, function (err, result) {     // result == 'JSON'
        if (err) throw err;
        AddOrderInDB(result);       // add order in DB
    });
    res.end("Acknowledge");
});

// response to database query
app.post('/DBquery', function (req, res) {

    // XML to JSON: req.body --> result
    parseXML(req.body, function (err, result) {     // result == 'JSON'
        if (err) throw err;

        DBquery(result);        // query database
    });
    res.end("Acknowledge");
});
// add product to order
app.post('/addProduct', function (req, res) {
    // XML to JSON: req.body --> result
    parseXML(req.body, function (err, result) {     // result == 'JSON'
        if (err) throw err;
        //console.log(result);
        AddProductInOrder(result);
    });
    res.end('Acknowledge');
});
// production call from UI build production XML
app.post('/production', function (req, res) {
    // XML to JSON: req.body --> result
    parseXML(req.body, function (err, result) {
        if (err) throw err;
        orderExist(result.orderId);     // order id exist in DB

        setTimeout(function () {
            if (orderIdExist) {     // if order exist build production XML
                buildProductionXML(result.orderId);

                // update production state to DB, 'ordered' --> 'production'
                connection.query("UPDATE order_has_products SET productState = 'production' WHERE idOrder = '" + result.orderId + "';", function (err, result) {
                    if (err) throw err;
                });
            }
        }, 700);
    });
    res.end('Acknowledge');
});

app.listen(portNbr, function () {
    console.log('Archive Application is running on http://localhost:' + portNbr);
});

// Http post
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
        }
    });
}
// add new order in DB
function AddOrderInDB(order) {
    //console.log(order);

    DBreturnCustomerId(order);  // check if customer already in DB
    DBreturnProductId(order);   // check if product already in DB

    setTimeout(function () {
        DBinsertOrder(order);   // insert order information in DB
    }, 1000);
}
// build production XML
function buildProductionXML(ID) {
    // check order which goes to production
    var selectQuery = "SELECT p.FrameType, p.FrameColor, p.ScreenType, p.ScreenColor, p.KeyboardType, p.KeyboardColor, oh.quantity ";
    var fromQuery = "FROM product p INNER JOIN order_has_products oh ON (p.idProduct = oh.idProduct ) ";
    var whereQuery = "WHERE oh.idOrder = '" + ID + "';";        // Order ID

    var theQuery = selectQuery + fromQuery + whereQuery;

    //Make an SQL request
    connection.query(theQuery, function (err, rows, fields) {       // order information in rows array
        if (!err) {
            //data = JSON.stringify(rows);
            //console.log(rows);

            var xmlProduction = new XMLWriter;              // build XML using 'xml-builder' library
            xmlProduction.startDocument('1.0', 'UTF-8');
            xmlProduction.startElement('Products');

            for (var i = 0; i < rows.length; i++) {

                xmlProduction.startElement('Phone');
                xmlProduction.writeElement('FrameType', rows[i].FrameType);
                xmlProduction.writeElement('FrameColor', rows[i].FrameColor);
                xmlProduction.writeElement('ScreenType', rows[i].ScreenType);
                xmlProduction.writeElement('ScreenColor', rows[i].ScreenColor);
                xmlProduction.writeElement('KeyboardType', rows[i].KeyboardType);
                xmlProduction.writeElement('KeyboardColor', rows[i].KeyboardColor);
                xmlProduction.writeElement('Quantity', rows[i].quantity);
                xmlProduction.endElement();
            }
            xmlProduction.endElement();
            xmlProduction.endDocument();

            // console.log(xmlProduction.toString());

            var URL = 'http://localhost:4444/productionInf';
            sendMessage(URL, xmlProduction.toString());           // send XML to main server


        } else {
            console.log('Error while performing Query.', err.toString());
        }
    });
}
// product added to existing order
function AddProductInOrder(product) {

    DBreturnProductId(product);             // check if product already in DB
    orderExist(product.root.orderId);       // check if order ID exists

    setTimeout(function () {
        if (orderIdExist) {         // order exist new product can be added to order
            var postOrderHasProduct = {             // new product to existing order
                idOrder: product.root.orderId,
                idProduct: productId,
                quantity: product.root.quantity,
                productState: 'ordered'
            };
            // Insert OrderHasProducts into database
            connection.query('INSERT INTO order_has_products SET ?;', postOrderHasProduct, function (err, result) {
                if (err) throw err;
            });
        }
    }, 1000);
}
// check if order ID exists
function orderExist(ID) {
    orderIdExist = false;
    var selectQuery = "SELECT oh.idOrder ";
    var fromQuery = "FROM order_has_products oh ";
    var whereQuery = "WHERE oh.productState = 'ordered' AND oh.idOrder = '" + ID + "';";

    var theQuery = selectQuery + fromQuery + whereQuery;

    // check if order ID exists in DB
    connection.query(theQuery, function (err, rows, fields) {
        if (!err) {
            data = JSON.stringify(rows);
            //Display the result.
            if (data == "[]") {
                console.log("Order Id does not exist or state is not 'ordered' ");
            }
            else {
                orderIdExist = true;

                // check if order in production or shipped

                selectQuery = "SELECT oh.idOrder ";
                fromQuery = "FROM order_has_products oh ";
                whereQuery = "WHERE (oh.productState = 'production' OR oh.productState = 'shipped') AND oh.idOrder = '" + ID + "';";

                theQuery = selectQuery + fromQuery + whereQuery;

                connection.query(theQuery, function (err, rows, fields) {
                    if (!err) {
                        data = JSON.stringify(rows);
                        //Display the result.
                        if (data != "[]") {
                            orderIdExist = false;
                            console.log("Order is in production or shipped, new product can't added");
                        }
                    } else {
                        console.log('Error while performing Query.', err.toString());
                    }
                });
            }
        } else {
            console.log('Error while performing Query.', err.toString());
        }
    });
}
// insert new  order in DB
function DBinsertOrder(order) {
    var orderDateTime = moment().format('YYYY-M-DD HH:mm:ss');      // use moment library to obtain current time
    var orderId;

    var postOrder = {
        OrderDate: orderDateTime,
        idCustomer: customerId
    };
    // Insert Order into database
    connection.query('INSERT INTO orders SET ?;', postOrder, function (err, result) {
        if (err) throw err;
        orderId = result.insertId.toString();
    });
    setTimeout(function () {            // Insert OrderHasProducts into database
        var postOrderHasProduct = {
            idOrder: orderId,
            idProduct: productId,
            quantity: order.root.quantity,
            productState: 'ordered'
        };
        console.log("CusID: " + customerId + ", ProID: " + productId + ", OrdId: " + orderId + ", Datetime: " + orderDateTime);

        // Insert OrderHasProducts into database
        connection.query('INSERT INTO order_has_products SET ?;', postOrderHasProduct, function (err, result) {
            if (err) throw err;
            orderId = result.insertId.toString();
        });
    }, 1000);
}
// check if customer in DB, else insert new customer
function DBreturnCustomerId(order) {

    var Query = "SELECT c.idCustomer FROM customer c WHERE c.CustomerName = '" + order.root.name + "' AND c.CustomerAddress = '" + order.root.address + "';";

    //Make an SQL request;  check if customer exists
    connection.query(Query, function (err, rows, fields) {
        if (!err) {
            data = JSON.stringify(rows);
            //Query result in data

            //Customer not in DB
            if (data == "[]") {

                var postCustomer = {
                    CustomerName: order.root.name,
                    CustomerAddress: order.root.address,
                    CustomerPhone: order.root.phone
                };

                // Insert new Customer into database
                connection.query('INSERT INTO customer SET ?;', postCustomer, function (err, result) {
                    if (err) throw err;
                    console.log("Customer NOT in DB, Customer Id: " + result.insertId.toString());
                    customerId = result.insertId.toString();
                });
            }   // customer already in DB, eturn customer id
            else {
                console.log("Customer already in DB, Customer Id: " + rows[0].idCustomer.toString());
                customerId = rows[0].idCustomer.toString();
            }

        } else {
            console.log('Error while performing Query.', err.toString());
        }
    });
}
// check if product in DB else inset new product
function DBreturnProductId(order) {

    var Query = "SELECT p.idProduct FROM product p WHERE p.FrameType = '" + order.root.frametype + "' AND p.FrameColor = '" + order.root.framecolor + "' AND p.ScreenColor = '" + order.root.screencolor + "' AND p.ScreenType = '" + order.root.screentype + "' AND p.KeyboardColor = '" + order.root.keyboardcolor + "' AND p.KeyboardType = '" + order.root.keyboardtype + "';";

    //Make an SQL request
    connection.query(Query, function (err, rows, fields) {
        if (!err) {
            data = JSON.stringify(rows);
            //Query result in data

            //Product not in DB
            if (data == "[]") {
                // product details
                var postProduct = {
                    FrameType: order.root.frametype,
                    FrameColor: order.root.framecolor,
                    ScreenType: order.root.screentype,
                    ScreenColor: order.root.screencolor,
                    KeyboardType: order.root.keyboardtype,
                    KeyboardColor: order.root.keyboardcolor
                };

                // Insert new Product into database
                connection.query('INSERT INTO product SET ?;', postProduct, function (err, result) {
                    if (err) throw err;
                    console.log("Product NOT in DB, Product Id: " + result.insertId.toString());
                    productId = result.insertId.toString();
                });
            }
            // product already in DB, return product id
            else {
                console.log("Product already in DB, Product Id: " + rows[0].idProduct.toString());
                productId = rows[0].idProduct.toString();
            }

        } else {
            console.log('Error while performing Query.', err.toString());
        }
    });
}
// check DB query user inserted in UI
function DBquery(Query) {
    var theQuery, information;

    // Querys

    // Plot orders of customer whose name was inserted
    if (Query.hasOwnProperty('queryName')) {

        var selectQuery = "SELECT c.CustomerName, c.idCustomer, o.idOrder, oh.idProduct, oh.quantity, o.OrderDate, oh.productState ";
        var fromQuery = "FROM customer c INNER JOIN orders o ON (c.idCustomer = o.idCustomer ) INNER JOIN order_has_products oh ON (o.idOrder = oh.idOrder ) ";
        var whereQuery = "WHERE c.CustomerName = '" + Query.queryName + "'" + " ORDER BY o.OrderDate;";

        information = "Customer: '" + Query.queryName + "', orders in production:";
        theQuery = selectQuery + fromQuery + whereQuery;
    }
    else if (Query.hasOwnProperty('queryField')) {      // user made own query

        theQuery = Query.queryField.toString();
        information = theQuery;
    }

    // Show all Orders
    else if (Query.query == "Orders") {
        var selectQuery = "SELECT c.CustomerName, c.idCustomer, o.idOrder, oh.idProduct, oh.quantity, o.OrderDate, oh.productState ";
        var fromQuery = "FROM customer c INNER JOIN orders o ON (c.idCustomer = o.idCustomer ) INNER JOIN order_has_products oh ON (o.idOrder = oh.idOrder ) ";
        var whereQuery = "ORDER BY o.OrderDate;";

        information = "ALL orders:";
        theQuery = selectQuery + fromQuery + whereQuery;
    }
    // Orders placed in last seven days
    else if (Query.query == "Last 7") {
        var selectQuery = "SELECT c.CustomerName, c.idCustomer, o.idOrder, oh.idProduct, oh.quantity, o.OrderDate, oh.productState ";
        var fromQuery = "FROM customer c INNER JOIN orders o ON (c.idCustomer = o.idCustomer ) INNER JOIN order_has_products oh ON (o.idOrder = oh.idOrder ) ";
        var whereQuery = "WHERE o.OrderDate >(subdate(curdate(), interval 7 day)) ORDER BY o.OrderDate;";

        information = "ORDERS in last 7 days:";
        theQuery = selectQuery + fromQuery + whereQuery;
    }
    // In production
    else if (Query.query == "Production") {
        var selectQuery = "SELECT p.idProduct, o.idOrder, oh.idProduct, oh.quantity, o.OrderDate, oh.productState ";
        var fromQuery = "FROM product p INNER JOIN order_has_products oh ON (p.idProduct = oh.idProduct ) INNER JOIN orders o ON (o.idOrder = oh.idOrder ) ";
        var whereQuery = "WHERE oh.productState = 'production' ORDER BY oh.idProduct;";

        information = "Products in production:";
        theQuery = selectQuery + fromQuery + whereQuery;
    }
    // Shipped products
    else if (Query.query == "Shipped") {
        var selectQuery = "SELECT c.CustomerName, c.idCustomer, o.idOrder, oh.idProduct, oh.quantity, o.OrderDeliverDate, oh.productState ";
        var fromQuery = "FROM customer c INNER JOIN orders o ON (c.idCustomer = o.idCustomer ) INNER JOIN order_has_products oh ON (o.idOrder = oh.idOrder ) ";
        var whereQuery = "WHERE oh.productState = 'shipped' ORDER BY o.OrderDeliverDate;";

        information = "Shipped products:";
        theQuery = selectQuery + fromQuery + whereQuery;
    }
    // customer orders in production
    else if (Query.query == "CustOrdInPro") {
        var selectQuery = "SELECT c.CustomerName, c.idCustomer, o.idOrder, oh.idProduct, oh.quantity, o.OrderDate, oh.productState ";
        var fromQuery = "FROM customer c INNER JOIN orders o ON (c.idCustomer = o.idCustomer ) INNER JOIN order_has_products oh ON (o.idOrder = oh.idOrder ) ";
        var whereQuery = "WHERE oh.productState = 'production' ORDER BY c.CustomerName;";

        information = "List of customers, whose products are currently in production:";
        theQuery = selectQuery + fromQuery + whereQuery;
    }

    //Make an SQL request
    connection.query(theQuery, function (err, rows, fields) {
        if (!err) {
            //data = JSON.stringify(rows);
            //Display the result.
            for (var i = 0; i < rows.length; i++) {

                // Change order date format
                if (rows[i].hasOwnProperty('OrderDate')) {
                    var parsing = JSON.stringify(rows[i]).split('OrderDate');
                    var orderDateTime = parsing[1].substr(3, 10) + ' ' + parsing[1].substr(14, 8);
                    rows[i].OrderDate = orderDateTime;
                }
            }

            var XML = XMLbuilder.buildObject(rows);     // query result to XML
            // console.log(XML);

            // send query result to MAIN server
            var URL = 'http://localhost:4444/dbQuery';
            sendMessage(URL, XML);

        } else {
            console.log('Error while performing Query.', err.toString());
        }
    });
}
// empty database tables
function DBemptyTables() {

    connection.query('TRUNCATE TABLE order_has_products;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    connection.query('TRUNCATE TABLE product;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    connection.query('TRUNCATE TABLE orders;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    connection.query('TRUNCATE TABLE customer;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });


    connection.query('ALTER TABLE product AUTO_INCREMENT = 1;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    connection.query('ALTER TABLE customer AUTO_INCREMENT = 1;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    connection.query('ALTER TABLE orders AUTO_INCREMENT = 1;', function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}