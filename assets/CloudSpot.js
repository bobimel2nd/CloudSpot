var InitTestDone = false;

function InitializeTest() {
	if (InitTestDone) return;

	if (PlayList.length > 0) displayPlaylists(0);
	$("button").removeAttr("disabled");
	InitTestDone = true;

	$("#allPlaylists").on("change", function() {
		displayPlaylistSongs(this.value);
	});

	$("#addList").on("click", function() {
		var Cnt = PlayList.length+1;
		var Name = prompt("Enter Name of Playlist", "Playlist " + Cnt);
		if (Name === null) {
			alert("List Addition Cancelled - User Request");
			return;
		}
		var idx = whichList(Name);
		if (idx !== -1) {
			alert("List Addition Cancelled - Already Exists");
			return;
		}
		FirebaseAddList(Name);
		$("#allPlaylists").val(Name).change();
	});

	$("#delList").on("click", function() {
		var Name = prompt("Enter Name of Playlist", $("#PlaylistName").text());
		if (Name === null) {
			alert("List Deletion Cancelled - User Request");
			return;
		}
		FirebaseDelList(Name);
		if (PlayList.length > 0) $("#allPlaylists").val(PlayList[0].Name).change();
	});

	$("#addSong").on("click", function () {
		var Name = $("#PlaylistName").text();
		var idx = whichList(Name);
		var Cnt = PlayList[idx].Songs.length+1;

		Cnt = prompt("Title", Cnt);
		if (Cnt === null) {
			alert("Song Addition Cancelled - User Request")
			return;
		}

		var Title = "Title " + Cnt;
		var Artist = "Artist " + Cnt;
		var Album = "Album " + Cnt;
		var Track = 0;
		var Duration = 0;
		if ($.isNumeric(Cnt)) {
			Track = Cnt;
			Duration = Cnt;
		}

		if (whichSong(idx, Title) !== -1) {
			alert("Song Addition Cancelled - Already Exists")
			return;
		}
		FirebaseAddSong(Name, Title, Artist, Album, Track, Duration);
	});

	$("#delSong").on("click", function () {
		var Name = $("#PlaylistName").text();
		var idx = whichList(Name);
		var sng = $("#bodyPlaylist tr.high-light").index();
		if (sng === -1) {
			alert("Nothing to Delete - No Song Selected");
			return;	
		}
		var Title = prompt("Title", PlayList[idx].Songs[sng].Title);
		if (Title === null) {
			alert("Song Deletion Cancelled - User Request")
			return;
		}
		FirebaseDelSong($("#PlaylistName").text(), Title);
	});

	$("#plySong").on("click", function () {
		var Name = $("#PlaylistName").text();
		var idx = whichList(Name);
		var sng = $("#bodyPlaylist tr.high-light").index();
		if (sng === -1) {
			alert("Nothing to Play - No Song Selected");
			return;	
		}
		alert("Playing " + PlayList[idx].Songs[sng].Title)
	});

    $(document).on("click","#bodyPlaylist tr",function() {
		$("#bodyPlaylist").find("tr").removeClass("high-light");
		$(this).addClass("high-light");
	});
}

function WaitForList(idx) {
    var poller1 = setInterval(function(){
        if(idx >= PlayList.length) return;
        clearInterval(poller1);
    },100);
}

function displayPlaylistSongs(Name) {
	var idx = whichList(Name);
	if ((PlayList.length-1) < idx) return;
	if (idx === -1) idx = 0;
	WaitForList(idx);
	ListStruct = cloneJSON(PlayList[idx]);
	$("#PlaylistName").text(ListStruct.Name);
	$("#bodyPlaylist").html("");
	if (ListStruct.Songs !== Empty)	{
		var objSongs = "";
		for (var i=0; i<ListStruct.Songs.length; i++) {
			var row = $("<tr>");

			var col = $("<td>");
			col.text(ListStruct.Songs[i].Title);
			row.append(col);
			
			var col = $("<td>");
			col.text(ListStruct.Songs[i].Artist);
			row.append(col);
			
			var col = $("<td>");
			col.text(ListStruct.Songs[i].Album);
			row.append(col);
			
			var col = $("<td>");
			col.text(ListStruct.Songs[i].Track);
			row.append(col);
			
			var col = $("<td>");
			col.text(ListStruct.Songs[i].Duration);
			row.append(col);
			
			$("#bodyPlaylist").append(row);
		}
	}
}

function displayPlaylists(idx) {
	$("#allPlaylists").html("");
	for (var i=0; i<PlayList.length; i++) {
		$("#allPlaylists").append($("<option/>", {
		    value: PlayList[i].Name,
		    text: PlayList[i].Name
		}));
	}	
}
