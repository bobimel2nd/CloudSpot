// For Standard Yes/No Popup Boxes
function popupYesNo(Txt, funcYes, funcNeg) {
	$("#YesNoContent").text(Txt);
    $('[data-popup="YesNo"]').fadeIn(350);

	$('#ansYes').on('click', function(e)  {
   		if (funcYes) funcYes();
 	    $('[data-popup="YesNo"]').fadeOut(350);
  	    $("#ansYes").off("click");
 	    $("#ansNeg").off("click");
       e.preventDefault();
    });
	$('#ansNeg').on('click', function(e)  {
   		if (funcNeg) funcNeg();
 	    $('[data-popup="YesNo"]').fadeOut(350);
  	    $("#ansYes").off("click");
 	    $("#ansNeg").off("click");
        e.preventDefault();
    });
}

// For Standard Prompt Popup Boxes
function popupPrompt(Txt, funcOks, funcCan ) {
	$('#PromptBox').val("");
	$("#PromptContent").text(Txt);
    $('[data-popup="Prompt"]').fadeIn(350);

    $('#PromptBox').on('keydown', function(e) {
	    gPass = $('#PromptBox').val();
	    if(e.which === 13) $('#ansOks').trigger("click");
	    if(e.which === 27) $('#ansCan').trigger("click");
    });

	$('#ansOks').on('click', function(e)  {
   		if (funcOks) funcOks();
 	    $('[data-popup="Prompt"]').fadeOut(350);
 	    $("#ansOks").off("click");
 	    $("#ansCan").off("click");
        e.preventDefault();
    });

	$('#ansCan').on('click', function(e)  {
   		if (funcCan) funcCan();
	    $('[data-popup="Prompt"]').fadeOut(350);
 	    $("#ansOks").off("click");
 	    $("#ansCan").off("click");
        e.preventDefault();
    });
}

// For Spotify Results Popup List
function popupSpotify(Songs, funcOks, funcCan ) {
	$("#bodySpotify").html("");
	for (var i=0; i<Songs.length; i++) {
		var row = $("<tr>");

		var col = $("<td>");
		col.text(Songs[i].Title);
		row.append(col);
		
		var col = $("<td>");
		col.text(Songs[i].Artist);
		row.append(col);
		
		var col = $("<td>");
		col.text(Songs[i].Album);
		row.append(col);
		
		var col = $("<td>");
		col.text(Songs[i].Track);
		row.append(col);
		
		var col = $("<td>");
		col.text(Songs[i].Duration);
		row.append(col);
		
		$("#bodySpotify").append(row);
	};
    $('[data-popup="Spotify"]').fadeIn(350);

    $(document).on("click","#bodySpotify tr",function() {
		$(this).toggleClass("high-light");
	});

	$('#sptOks').on('click', function(e)  {
   		if (funcOks) funcOks();
 	    $('[data-popup="Spotify"]').fadeOut(350);
 	    $("#sptOks").off("click");
 	    $("#sptCan").off("click");
		$(document).off("click", "#bodySpotify tr");
        e.preventDefault();
    });

	$('#sptCan').on('click', function(e)  {
   		if (funcCan) funcCan();
	    $('[data-popup="Spotify"]').fadeOut(350);
 	    $("#sptOks").off("click");
 	    $("#sptCan").off("click");
		$(document).off("click", "#bodySpotify tr");
        e.preventDefault();
    });
}
