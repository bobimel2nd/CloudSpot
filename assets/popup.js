//----- OPEN by function
function DataPopupOpen(targeted_popup_class, src) {
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
   	$("#popup-video").attr("src", src + "?&autoplay=1");

    //----- CLOSE
    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
 	    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
    	$("#popup-video").attr("src","#");

        e.preventDefault();
    })

}
