var InitTestDone = false;

function InitializeTest() {
	if (InitTestDone) return;

	if (PlayList.length > 0) DisplayPlaylist(0);
	$("button").removeAttr("disabled");
	InitTestDone = true;

	$("#NxtList").on("click", function () {
		var Name = $("#PlaylistName").text();
		DisplayPlaylist(FirebaseNxtList(Name));
	});

	$("#NewList").on("click", function () {
		var Cnt = PlayList.length+1;
		var Name = prompt("Enter Name of Playlist", "Playlist " + Cnt);
		DisplayPlaylist(FirebaseAddList(Name));
	});

	$("#AddSong").on("click", function () {
		var Name = $("#PlaylistName").text();
		var idx = whichList(Name);
		var Cnt = PlayList[idx].Songs.length+1;
		var Album = prompt("Album", "Album " + Cnt);
		var Artist = prompt("Artist", "Artist " + Cnt);
		var Title = prompt("Title", "Title " + Cnt);
		var Duration = prompt("Duration", Cnt);
		DisplayPlaylist(FirebaseAddSong(Name, Album, Artist, Title, Duration));
	});

	$("#DelSong").on("click", function () {
		var Name = $("#PlaylistName").text();
		var idx = whichList(Name);
		var Title = prompt("Title", PlayList[idx].Songs[PlayList[idx].Songs.length-1].Title);
		DisplayPlaylist(FirebaseDelSong($("#PlaylistName").text(), Title));
	});

	$("#DelList").on("click", function () {
		var Name = prompt("Enter Name of Playlist", $("#PlaylistName").text());
		DisplayPlaylist(FirebaseDelList(Name));
	});

	$("#PrvList").on("click", function () {
		var Name = $("#PlaylistName").text();
		DisplayPlaylist(FirebasePrvList(Name));
	});
}

function WaitForList(idx) {
    var poller1 = setInterval(function(){
        if(idx >= PlayList.length) return;
        clearInterval(poller1);
    },100);
}

function DisplayPlaylist(idx) {
	if ((PlayList.length-1) < idx) return;
	if (idx === -1) idx = 0;
	WaitForList(idx);
	ListStruct = cloneJSON(PlayList[idx]);
	$("#PlaylistName").text(ListStruct.Name);
	$("#Playlist").text("");
	if (ListStruct.Songs !== Empty)	{
		var objSongs = "";
		for (var i=0; i<ListStruct.Songs.length; i++) {
			var row = $("<div>");
			row.addClass("row");
			
			var col = $("<div>");
			col.addClass("col-xs-3");
			col.text(ListStruct.Songs[i].Album);
			row.append(col);
			
			col = $("<div>");
			col.addClass("col-xs-3");
			col.text(ListStruct.Songs[i].Artist);
			row.append(col);
			
			col = $("<div>");
			col.addClass("col-xs-3");
			col.text(ListStruct.Songs[i].Title);
			row.append(col);
			
			col = $("<div>");
			col.addClass("col-xs-3");
			col.text(ListStruct.Songs[i].Duration);
			row.append(col);

			$("#Playlist").append(row);
		}
	}
}
