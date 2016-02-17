var GMaps = require("gmaps");

// Gmaps code needs to be in $(document).ready format in order to load properly
$(function () {
  var map = new GMaps({
    div: '#map',
    lat: -12.043333,
    lng: -77.028333
  });
});
