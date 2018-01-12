var InitDone = false;
var gPass = "";

$(document).ready(function() {
	firebaseInitialize();
	plexInitialize();
	appInitialize();
});


function appInitialize() {

	if (PlayList.length > 0) displayPlaylists(0);
	$("button").removeAttr("disabled");

	$("#allPlaylists").on("change", function() {
		displayPlaylistSongs(this.value);
	});

	$("#addList").on("click", function() {
		popupPrompt("Enter Name of New List ", function() {
			var Name = gPass;
			if (Name === null) return;
			var idx = whichList(Name);
			if (idx !== -1) {
				alert("List Addition Cancelled - Already Exists");
				return;
			}
			firebaseAddList(Name);
			$("#allPlaylists").val(Name).change();
		}, null);
	});

	$("#delList").on("click", function() {
		var Name = $("#PlaylistName").text();
		if (Name === null) {
			alert("List Deletion Cancelled - User Request");
			return;
		}
		popupYesNo("Really Delete List \"" + Name + "\"", function() {
			var Name = $("#PlaylistName").text();
			firebaseDelList(Name);
			if (PlayList.length > 0)
				$("#allPlaylists").val(PlayList[0].Name).change();
		}, null);
	});

	$("#addSong").on("click", function () {
		popupPrompt("Enter Search Criteria", function() {
			plexSearch(gPass);
		}, null);
	});

	$("#delSong").on("click", function () {
		var Name = $("#PlaylistName").text();
		var idx = whichList(Name);
		var sng = $("#bodyPlaylist tr.high-light").index();
		if (sng === -1) {
			alert("Nothing to Delete - No Song Selected");
			return;	
		}
		popupYesNo("Really Delete Song \""  + PlayList[idx].Songs[sng].Title + "\"", function() {
			var Name = $("#PlaylistName").text();
			var idx = whichList(Name);
			var sng = $("#bodyPlaylist tr.high-light").index();
			firebaseDelSong(Name, PlayList[idx].Songs[sng].Title);
		}, null);
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

function WaitForSearch(idx) {
    var poller1 = setInterval(function(){
        if(gSearch) return;
        clearInterval(poller1);
    },100);
}

function displayPlaylistSongs(Name) {
	var idx = whichList(Name);
	if ((PlayList.length-1) < idx) return;
	if (idx === -1) {
		ListStruct = cloneJSON(cLists);
		ListStruct.Songs = Empty;
	} else {
		WaitForList(idx);
		ListStruct = cloneJSON(PlayList[idx]);
	}
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
	if (PlayList.length === 0) displayPlaylistSongs(null)
	for (var i=0; i<PlayList.length; i++) {
		$("#allPlaylists").append($("<option/>", {
		    value: PlayList[i].Name,
		    text: PlayList[i].Name
		}));
	}	
}

function SpotifySearch(Srch) {
	var Songs = [];

	for(i=1; i<PickInteger(1,21); i++) {
		var SongStruct = cloneJSON(cSongs);
		SongStruct.MediaID = "Key " + i;
		SongStruct.Title = Srch + " " + i; 
		SongStruct.Artist = "Artist " + i; 
		SongStruct.Album = "Album " + i; 
		SongStruct.Track = i; 
		SongStruct.Duration = i;
		Songs.push(SongStruct); 
	}
	return Songs;
}

function PickInteger(Low, High) {
	return Math.floor(Math.random()*(High-Low+1) + Low);
};
