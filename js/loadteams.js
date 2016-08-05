$.ajaxSetup({beforeSend: function(xhr){
  if (xhr.overrideMimeType)
  {
    xhr.overrideMimeType("application/json");
  }
}
});

var teamdata;
$.getJSON("json/teams.national.json", function (json) { teamdata = json } );