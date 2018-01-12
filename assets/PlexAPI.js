var plexUser;
var plexServer;
var plexAccess;
var plexAddress;
var plexPort;

function plexInitialize() {
    $.ajax({
        url: 'https://plex.tv/users/sign_in.json',
        type: 'POST',
        headers: {  "X-Plex-Client-Identifier": "1",
                    "X-Plex-Product": "CloudSpot",
                    "X-Plex-Version": "1.1.1",
                }, 
        data: 'user[login]=bolt.up.bob@gmail.com&user[password]=BootCampSpotV2',
        dataType: 'json',
        success: function(response) {
            plexUser = response.user;
            $.ajax({ 
                url: "https://plex.tv/pms/servers.xml",
                type: "GET",
                headers: {  "X-Plex-Client-Identifier": "1",
                            "X-Plex-Product": "CloudSpot",
                            "X-Plex-Version": "1.1.1"       },
                data: "X-Plex-Token=" + plexUser.authToken,
                dataType: "xml",
                success: function(response) {
                    plexServer = response.childNodes[0].children[0].attributes;
                    plexAccess = plexServer["accessToken"].nodeValue;
                    plexAddress = plexServer["address"].nodeValue;
                    plexPort = plexServer["port"].nodeValue;
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log('boo!');
                    console.log('------1----Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + '  Ready State: ' + xhr.readyState + 'thrownError: ' + thrownError);
                }
            })
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log('boo!');
            console.log('------1----Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + '  Ready State: ' + xhr.readyState + 'thrownError: ' + thrownError);
        }
    });
}

function plexSearch(title) {
    title = title.replace(" ", "+");
    title = title.replace(":", "+");
    title = title.replace("-", "+");
    title = title.replace(",", "+");
    title = title.replace("&", "+");
    Results = [];   
    $.ajax({ 
        url: "https://" + plexAddress + ":" + plexPort + "/search",
        type: "GET",
        headers: {  "Accept": "application/json",
                    "X-Plex-Client-Identifier": "1",
                    "X-Plex-Product": "CloudSpot",
                    "X-Plex-Version": "1.1.1",
                }, 
        data: "X-Plex-Token=" + plexAccess + "&type=10&query=" + title,
        dataType: "json",
        success: function(response) {
            var Results = [];
            var All = response.MediaContainer.Metadata;
            for (var i=0; i<All.length; i++) {
                var ListStruct = cloneJSON(cLists);
                ListStruct.MediaID = All[i].key;
                ListStruct.Title = All[i].title;
                ListStruct.Album = All[i].parentTitle;
                ListStruct.Artist = All[i].grandparentTitle;
                ListStruct.Track = All[i].index;
                ListStruct.Duration = All[i].duration;
                Results.push(ListStruct);
            }
            popupSpotify(Results, function() {
                var Name = $("#PlaylistName").text();
                $("#bodySpotify tr.high-light").each(function() {
                    idx = $(this).index();
                    var MediaID = Results[idx].MediaID;
                    var Title = Results[idx].Title;
                    var Artist = Results[idx].Artist;
                    var Album = Results[idx].Album;
                    var Track = Results[idx].Track;
                    var Duration = Results[idx].Duration;
                    firebaseAddSong(Name, MediaID, Title, Artist, Album, Track, Duration);
                });
            }, null);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log('boo!');
            console.log('------1----Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + '  Ready State: ' + xhr.readyState + 'thrownError: ' + thrownError);
        }
    });
}
