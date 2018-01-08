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

var Empty = "Empty";
var cSongs = {	"Title":"", 
				"Artist":"", 
				"Album":"",
				"Track":"", 
				"Duration":0};
var cLists = {	"Name": "",
				"Songs": []};

var SongStruct = cloneJSON(cSongs);
var ListStruct = cloneJSON(cLists);
var PlayList = [];
var PlayKeys = [];

$(document).ready(function() {
	Initialize();
});

function cloneJSON(obj) {
    // basic type deep copy
    if (obj === null || obj === undefined || typeof obj !== 'object')  {
        return obj
    }
    // array deep copy
    if (obj instanceof Array) {
        var cloneArray = [];
        for (var i = 0; i < obj.length; ++i) {
            cloneArray[i] = cloneJSON(obj[i]);
        }              
        return cloneArray;
    }                  
    // object deep copy
    var cloneObject = {};   
    for (var i in obj) {
        cloneObject[i] = cloneJSON(obj[i]);
    }                  
    return cloneObject;
}

function Initialize() {
	firebase.initializeApp(FirebaseConfig);
	database = firebase.database();

	// At the initial load, get a snapshot of the current data.
	database.ref().on("child_added", function(playlistSnapshot) {
		// If we got data
		if (playlistSnapshot.numChildren() > 0) {
			ListStruct = cloneJSON(playlistSnapshot.val());
			if (ListStruct.Songs === Empty) ListStruct.Songs = [];
			PlayList.push(cloneJSON(ListStruct));
			PlayKeys.push(playlistSnapshot.key);
			displayPlaylists();
		}
	}, function(errorObject) {
		alert("The read failed: " + errorObject.code);
	});


	// At the initial load, get a snapshot of the current data.
	database.ref().on("child_changed", function(playlistSnapshot) {
		// If we got data
		if (playlistSnapshot.numChildren() > 0) {
			ListStruct = cloneJSON(playlistSnapshot.val());
			if (ListStruct.Songs === Empty) ListStruct.Songs = [];
			var idx = whichList(ListStruct.Name);
			PlayList[idx] = cloneJSON(ListStruct);
			displayPlaylistSongs(PlayList[idx].Name);
		}
	}, function(errorObject) {
		alert("The read failed: " + errorObject.code);
	});

	// At the initial load, get a snapshot of the current data.
	database.ref().on("child_removed", function(playlistSnapshot) {
		// If we got data
		if (playlistSnapshot.numChildren() > 0) {
			ListStruct = cloneJSON(playlistSnapshot.val());
			var idx = whichList(ListStruct.Name);
			PlayList.splice(idx,1);
			PlayKeys.splice(idx,1);
			displayPlaylists();
		}
	}, function(errorObject) {
		alert("The read failed: " + errorObject.code);
	});

	InitializeTest();  // Returns if already done
}

function whichList(ListName) {
	return PlayList.findIndex(Itm => Itm.Name === ListName);
}

function whichSong(idx, SongName) {
	if (PlayList[idx].Songs === Empty) return -1;
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
	ListStruct = cloneJSON(cLists);
	ListStruct.Name = ListName;
	ListStruct.Songs = Empty;

	// add this Playlist to Firebase
	database.ref().push(ListStruct);
	return idx;
}

function FirebaseAddSong(ListName, Title, Artist, Album, Track, Duration) {
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
	SongStruct = cloneJSON(cSongs);
	SongStruct.Title = Title;
	SongStruct.Artist = Artist;
	SongStruct.Album = Album;
	SongStruct.Track = Track;
	SongStruct.Duration = Duration;
	ListStruct = cloneJSON(PlayList[idx]);
	ListStruct.Songs.push(SongStruct);
	// New Song in existing Playlist
	database.ref(PlayKeys[idx]).update(ListStruct);
	return idx;
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
	ListStruct = cloneJSON(PlayList[idx]);
	ListStruct.Songs.splice(itm, 1);
	if (ListStruct.Songs.length === 0) ListStruct.Songs = Empty;
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

function FirebaseGetList(ListName) {
	// Find Requested Playlist
	var idx = PlayList.findIndex(Itm => Itm.Name === ListName);
	if (idx === -1) {
		alert("PlayList "  + ListName + " does not exists");
		console.log("PlayList "  + ListName + " does not exists");
	}
	return PlayList[idx].Songs;
}
