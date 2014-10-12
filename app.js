var express = require('express');
var qs = require('querystring');
var mongo = require('mongodb');
var crypto = require('crypto');
var util = require('./util.js');


var databaseUrl = "localhost:27017/ecommit"; // "username:password@example.com/mydb"
var collections = ["users"]
var db = require("mongojs").connect(databaseUrl, collections);


var app = express();



app.get('/register',function(request,response){
	response.end("<html><head><title></title></head><body><form action=\"/addUser\" method=\"POST\"> Name: <input name=\"name\"/> Email: <input name=\"email\"/> Password: <input name=\"password\"/> Confirm Password: <input name=\"confirmPassword\"/><button type=\"submit\">Register</button></form></body></html>");
});


app.post('/addUser',function(request,response){
	var body = '';
    request.on('data', function (data) {
        body += data;
		
		// Too much POST data, kill the connection!
        if (body.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
    	var post = qs.parse(body);
    	util.validateUser(post.name, post.email , post.password, post.confirmPassword,request,response);
    });

   
});




var server=app.listen(3000,function(){
	console.log('Starting server: ');
});
