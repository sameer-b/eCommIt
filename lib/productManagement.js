var um = require('./userManagement.js');
var mongo = require('mongodb');
var qs = require('querystring');
var cookieParser = require('cookie-parser');

var databaseUrl = "localhost:27017/ecommit"; // "username:password@example.com/mydb"
var collections = ["products"];
var db = require("mongojs").connect(databaseUrl, collections);


var insertProduct = function(product) {

	var specs = JSON.parse(JSON.stringify(product));
	
	delete specs.productDescription;
	delete specs.productPrice;
	delete specs.productName;

	db.products.count({}, function(error, numOfDocs) {
	
		var newProduct={'productID': (++numOfDocs) , 'productDescription': product.productDescription , 'productPrice': product.productPrice, 'productName' : product.productName, 'specs' : specs };
		
		db.products.save(newProduct, function (err, saved) {
  			if( saved ) {
				console.log("Product  saved");
  			}

  			else
  				console.log("Product not saved");
		});
    
	});

	
}


exports.showProduct = function ( request , response, productID ) {

	var query = { 'productID' : parseInt(productID) };

  	db.products.findOne( query , function( err, product ) {
  		um.authenticateUser(request.cookies , response , 'showProduct' , { data : product })
	});
}


exports.addNewProduct = function ( request, response ) {
	var body = '';
    request.on('data', function (data) {
        body += data;

        // Too much product data, kill the connection!
        if (body.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
        var product = qs.parse(body);
        insertProduct(product);
    });
}