//var plexBase = "http://192.168.1.100:32400";
var plexBase = "https://68-7-196-55.13320b9ce6a54c899f24afe392bf14e1.plex.direct:32400";
var plexCode = "X-Plex-Token=vkqRfaPLgiVgf4nevfyx";
var gTitle;
var gResults;

function plexSearch(title) {
  title = title.replace(" ", "+");
  title = title.replace(":", "+");
  title = title.replace("-", "+");
  title = title.replace(",", "+");
  gTitle = title.replace("&", "+");
  Results = [];   
  var queryURL = plexBase + "/search?type=10&query=" + gTitle + "&" + plexCode;
  $.ajax({ 
    url: queryURL, 
    headers: {"Accept": "application/json"}, 
    method: "GET" })
  .done(function(response) {
    var Results = [];
    var All = response.MediaContainer.Metadata;
    for (var i=0; i<All.length; i++) {
      var ListStruct = cloneJSON(cLists);
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
        var Title = $(this).find("td").eq(0).text();
        var Artist = $(this).find("td").eq(1).text();
        var Album = $(this).find("td").eq(2).text();
        var Track = $(this).find("td").eq(3).text();
        var Duration = $(this).find("td").eq(4).text();
        FirebaseAddSong(Name, Title, Artist, Album, Track, Duration);
      });
    }, null);
  })
}
