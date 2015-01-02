var um = require('./userManagement.js');
var mongo = require('mongodb');
var fs = require('fs');
var formidable = require("formidable");
var appCredentials = require('./applicationCredentials.js');

var databaseUrl = appCredentials.databaseUrl ; // "username:password@example.com/mydb"
var collections = ["products"];
var db = require("mongojs").connect(databaseUrl, collections);

var getImagesFromForm =  function(files) {
	var images = {};
	var numberOfImages=0;
	for( var image in files) {
		numberOfImages++;
		var data = fs.readFileSync(files[image].path);
		var imageField='image'+numberOfImages;
		images[imageField] =  new mongo.Binary(data);
	}

	return images;
};


var getNumberOfSpecs = function ( specs ) {
	var size = 0;
	for ( var spec in specs) {
		size++;
	}
	return size/2;

};

var updateProduct = function ( request, response, newProduct, files, productID) {





			//response.render(view, {data : product });
			var specs = JSON.parse(JSON.stringify(newProduct));

			delete specs.productDescription;
			delete specs.productPrice;
			delete specs.productName;
			delete specs.productSummary;

			var productSpecs = {};

			for(var  i = 1 ; i <= getNumberOfSpecs(specs) ; ++i ) {
				productSpecs[specs['spec'+i]] = specs['value'+i];
			}


			db.products.update(
				{ 'productID' : parseInt(productID)},
				{
					$set: {
						'productSummary' : newProduct.productSummary,
						'productDescription': newProduct.productDescription ,
						'productPrice': newProduct.productPrice,
						'productName' : newProduct.productName,
						'specs' : productSpecs
					}
				},
				function (err, result) {
					if (err) throw err;
					response.render('message',{message:'Product Updated!'});


				}
			)
};

var insertProduct = function (request, response, product, files) {

	var specs = JSON.parse(JSON.stringify(product));

	delete specs.productDescription;
	delete specs.productPrice;
	delete specs.productName;
	delete specs.productSummary;

	var productSpecs = {};

	for(var  i = 1 ; i <= getNumberOfSpecs(specs) ; ++i ) {
		productSpecs[specs['spec'+i]] = specs['value'+i];
	}


	db.products.count({}, function(error, numOfDocs) {

		var newProduct={
			'productID': (++numOfDocs) ,
			'productSummary' : product.productSummary,
			'productDescription': product.productDescription ,
			'productPrice': product.productPrice,
			'productName' : product.productName,
			'specs' : productSpecs
		};
		var images = getImagesFromForm(files);
		newProduct['images'] = images;

		db.products.save(newProduct, function (err, saved) {
  			if( saved ) {
				console.log("Product  saved");
				response.render('message',{message:'Product Saved!'});
				return;

  			}

  			else
  				console.log("Product not saved");
				response.render('error',{message:'Product Not Saved!'});


		});
    
	});
	
};

exports.editProduct = function ( request, response , productID) {
	this.showProduct(request,response,productID,'editProduct');
};


exports.showProduct = function ( request , response, productID, view ) {
	var query = { 'productID' : parseInt(productID) };

  	db.products.findOne( query , function( err, product ) {
		if(product == null ) {
			response.render('error',{message:"Sorry product not found! "});
			//um.authenticateUser(request.cookies, response, 'message' , {message:"Sorry product not found!"})
		}
		else{
			response.render(view, {data : product });
			//um.authenticateUser(request.cookies , response , view , { data : product });
		}

	});
};


exports.addNewProduct = function ( request, response ) {
	var form = new formidable.IncomingForm();
	form.parse(request, function (err, fields, files) {
	insertProduct(request, response,fields,files);
	});
};


exports.listProducts = function ( request, response ){
	db.products.find( {} , function( err, product ) {
		if(product == null ) {
			response.render('error', {message : "Sorry no product found!"});
			//um.authenticateUser(request.cookies, response, 'message', {message:"Sorry no products found!"});
		}
		else{
			response.render('showAllProducts', { data : product });
			//um.authenticateUser(request.cookies , response , 'showAllProducts' , { data : product });
		}

	});
};


exports.updateProduct = function ( request, response ,productID  ) {
	var form = new formidable.IncomingForm();
	form.parse(request, function (err, fields, files) {
		updateProduct(request, response,fields,files, productID);
	});
};