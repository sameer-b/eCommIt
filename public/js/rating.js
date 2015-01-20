/**
 * Created by Sameer on 1/18/2015.
 */



$( document ).ready( function(data) {

    $('#ratingSlider').on("change mousemove", function() {
        $(this).next().attr('value',($(this).val()));
    });

});


