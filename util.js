var mongo = require('mongodb');
var crypto = require('crypto');



var databaseUrl = "localhost:27017/ecommit"; // "username:password@example.com/mydb"
var collections = ["users"]
var db = require("mongojs").connect(databaseUrl, collections);



var IsEmail = function(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

var addNewUser = function (name,email,password){
	var user={"name": name, "email": email , "password ": password};
	db.users.save(user, function(err, saved) {
  	if( saved ) console.log("User  saved");
  	else console.log("User not saved");
});

}


exports.validateUser = function (name,email,password,confirmPassword,request,response) {
	
	if(password!==confirmPassword) {
		response.end('Sorry passwords do not match!');
		return;
	}

	if(!IsEmail(email)) {
		response.end("Sorry invalid Email address");
		return;
	}
	
	
	db.users.find( { email: { $in: [ email ] } }, function(err,user){
	
	if ( user.length>0 ){
		response.end("Sorry email already exists!");
		return;
	}
	else{
		var shasum=crypto.createHash('sha1');
		shasum.update(password);
		addNewUser(name,email,shasum.digest('hex'));
		response.end("You have successfully registered!");
		return;
	}

	});


	
}