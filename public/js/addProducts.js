 
 $( document ).ready( function() {
 	var numberOfSpecs = 1;
 	$('.specButton').click( function() {
 		var addSpec = "<input class = 'col-md-4' class = 'input-block-level', type = 'text' , name = 'spec"+(++numberOfSpecs)+"' placeholder = 'Specification "+numberOfSpecs+"' />";
  		var addSpecValue = "<input class = 'col-md-4' class = 'input-block-level', type = 'text' , name = 'value"+(numberOfSpecs)+"' placeholder = 'Value of specification "+numberOfSpecs+"' /> </br>"; 
 		$('.specButton').before(addSpec,addSpecValue);
 	});
 });

 $( document ).ready( function(data) {

 });

 var renderImages = function ( data ) {
	 for(var img in(data.images)) {
		 var source = "data:image/png;base64,"+data.images[img];
		 var tag = "<img src=\""+source+"\"/>";
		 $(".imageBox").append(tag);
	 }


 };