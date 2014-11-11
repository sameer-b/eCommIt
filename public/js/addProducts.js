$( document ).ready( function(data) {

});



 /*
 This function attaches a listener on the button to add more specs.
  */
 $( document ).ready( function() {
 	var numberOfSpecs = 1;
 	$('.specButton').click( function() {
 		var addSpec = "<input class = 'col-md-4' class = 'input-block-level', type = 'text' , name = 'spec"+(++numberOfSpecs)+"' placeholder = 'Specification "+numberOfSpecs+"' />";
  		var addSpecValue = "<input class = 'col-md-4' class = 'input-block-level', type = 'text' , name = 'value"+(numberOfSpecs)+"' placeholder = 'Value of specification "+numberOfSpecs+"' /> </br>"; 
 		$('.specButton').before(addSpec,addSpecValue);
 	});
 });

/*
This function attaches a listener on the button to add more images.
 */

$( document ).ready( function() {
	var numberOfSpecs = 1;
	$('.imageButton').click( function() {
		var addImg = "<input class = 'col-md-4' class = 'input-block-level', type = 'file' , name = 'image"+(++numberOfSpecs)+"'  /> </br>";
		$('.imageButton').before(addImg);
	});
});


 /*
 	This function initializes the thumbnails
  */

 var renderImages = function ( data ) {
	 imageNumber = 0;
	 var tag = "";
		 for(var img in(data.images)) {
			 imageNumber++;
			 var source = "data:image/png;base64,"+data.images[img];
			 tag = "<img src=\""+source+"\" id=\"thumbnail"+imageNumber+ "\" />";
			 $(".thumbnail").append(tag);
		}
	 //After setting the thumbnails also set the preview image.
	 $('.preview').append(tag);



 };

/*
	This function adds ability to click on the thumbnail and have it appear in the preview.
 */
 $( document ).ready( function(data) {

	$('.thumbnail').children().click(function(){
		$('.preview').children().remove();
		$('.preview').append($(this).clone());
	});

 });

/*
This function enables clicking on the preview for the lightbox to show up.
 */

 $( document ).ready( function(data) {
	 $('.preview').click(function() {
		 var source = ($(this).children().attr("src"));
		 ($(this).attr(
			 {
				 "data-lightbox" : "image-1",
				 "href" : source
			 }
		 ));
	 });
 });