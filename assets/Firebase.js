// Initialize Firebase
const FirebaseConfig = {
	apiKey: "AIzaSyDDpiQCcpEHqIN_g5jnxiz3OvKgXmEQ4Aw",
	authDomain: "cloudspot-313a6.firebaseapp.com",
	databaseURL: "https://cloudspot-313a6.firebaseio.com",
	projectId: "cloudspot-313a6",
	storageBucket: "cloudspot-313a6.appspot.com",
	messagingSenderId: "207128364222"
};
var database;
var Key;

const Empty = "Empty";
const cSongs = {	"Album":"", 
					"Artist":"", 
					"Title":"", 
					"Duration":0};
const cLists = {	"Name": "",
					"Songs": []};

var SongStruct = cSongs;
var ListStruct = cLists;
var PlayList = [];
var PlayKeys = [];

var Initializing = true;

$(document).ready(function() {
	Initialize();
});

function Initialize() {
	firebase.initializeApp(FirebaseConfig);
	database = firebase.database();

	// At the initial load, get a snapshot of the current data.
	database.ref().on("child_added", function(playlistSnapshot) {
		// If we got data
		if (playlistSnapshot.numChildren() > 0) {
			ListStruct = playlistSnapshot.val();
			if (ListStruct.Songs === Empty) ListStruct.Songs = [];
			PlayList.push(ListStruct);
			PlayKeys.push(playlistSnapshot.key);
			InitializeTest();  // Returns if already done
		}
	}, function(errorObject) {
		alert("The read failed: " + errorObject.code);
	});


	// At the initial load, get a snapshot of the current data.
	database.ref().on("child_removed", function(playlistSnapshot) {
		// If we got data
		if (playlistSnapshot.numChildren() > 0) {
			ListStruct = playlistSnapshot.val();
			var idx = whichList(ListStruct.Name);
			PlayList.splice(idx,1);
			PlayKeys.splice(idx,1);
		}
	}, function(errorObject) {
		alert("The read failed: " + errorObject.code);
	});

}

function whichList(ListName) {
	return PlayList.findIndex(Itm => Itm.Name === ListName);
}

function whichSong(idx, SongName) {
	return PlayList[idx].Songs.findIndex(Itm => Itm.Title === SongName);
}

function Notify(text) {
	alert(text);
	console.log(text);
}

function FirebaseNxtList(ListName) {
	var idx = whichList(ListName);
	if (idx < PlayKeys.length-1) idx++;
	return idx;	
}

function FirebaseAddList(ListName) {
	// Check to see if Playlist already exists
	var idx = whichList(ListName);
	if (idx !== -1) {
		Notify("PlayList "  + ListName + " already exists at " + idx);
		return idx;
	}
	idx = PlayList.length;
	// Add to Playlists with no Songs
	ListStruct = cLists;
	ListStruct.Name = ListName;
	ListStruct.Songs = Empty;

	// add this Playlist to Firebase
	database.ref().push(ListStruct);
	return idx;
}

function FirebaseAddSong(ListName, Album, Artist, Title, Duration) {
	// Find the Playlist the user want to add to
	var idx = whichList(ListName);
	if (idx === -1) {
		Notify("PlayList "  + ListName + " does not exist");
		return -1;
	}
	// See if this song already exists
	var itm = whichSong(idx, Title);
	if (itm !== -1) {
		Notify("Song "  + Title + " already exists at " + itm);
		return idx;
	}
	// Add the Song to Array
	SongStruct = cSongs;
	SongStruct.Album = Album;
	SongStruct.Artist = Artist;
	SongStruct.Title = Title;
	SongStruct.Duration = Duration;
	ListStruct = PlayList[idx];
	ListStruct.Songs.push(SongStruct);
	// New Song in existing Playlist
	database.ref(PlayKeys[idx]).update(ListStruct);
	return PlayKeys[idx].length;
}

function FirebaseDelSong(ListName, Title) {
	// Find the Playlist the user wants to Delete from
	var idx = whichList(ListName);
	if (idx === -1) {
		Notify("PlayList "  + ListName + " does not exist");
		return -1;
	}
	// See if this song already exists
	var itm = whichSong(idx, Title);
	if (itm === -1) {
		Notify("Song "  + Title + " does not exist");
		return -1;
	}
	ListStruct = PlayList[idx];
	ListStruct.Songs.splice(itm, 1);
	// Delete Song From existing Playlist
	database.ref(PlayKeys[idx]).update(ListStruct);
	if (idx === PlayKeys.length-1) idx--;
	return idx;
}

function FirebaseDelList(ListName) {
	// Find the Playlist the user wants to Delete from
	var idx = whichList(ListName);
	if (idx === -1) {
		Notify("PlayList "  + ListName + " does not exist");
		return idx;
	}
	// Delete the Playlist
	database.ref(PlayKeys[idx]).remove();
	return idx;
}

function FirebasePrvList(ListName) {
	var idx = whichList(ListName);
	if (idx > 0) idx--;
	return idx;	
}

/*
function FirebaseGetList(ListName) {
	// Find Requested Playlist
	var idx = PlayList.findIndex(Itm => Itm.Name === ListName);
	if (idx === -1) {
		alert("PlayList "  + ListName + " does not exists");
		console.log("PlayList "  + ListName + " does not exists");
	}
	return PlayList[idx].Songs;
}

 */