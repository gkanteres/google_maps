var GMaps = require("gmaps");
var destinationKey = "AIzaSyDp0QftGXRtod_pyaNZeQnMbJScGQ87F40";
// var destinationKey = "AIzaSyDEf3D-N_JjVjOPBLwpmHCna-gegi5GcDs";
var KEY = "e0aa4703629c3d46bd310eee601b23ff";

// Gmaps code needs to be in $(document).ready format in order to load properly
$(function () {
  var map = new GMaps({
    div: '#map',
    lat: -12.043333,
    lng: -77.028333
  });
  $(".map-location").submit(function(event){
    event.preventDefault();
    GMaps.geocode({
      address: $('#address').val(),
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          map.setCenter(latlng.lat(), latlng.lng());
          map.removeMarkers();
          map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng()
          });
        }
      }
    });
  });

  $(".map-destination").submit(function(event){
    event.preventDefault();
    // var origin = $("#origin").val();
    // var destination = $("#destination").val();
    // $.get('http://api.openweathermap.org/data/2.5/weather?q=' + "Portland" + '&appid=' + KEY, function(response) {
    //     console.log(response);
    //   });
    //  $.get('http://maps.googleapis.com/maps/api/distancematrix/json?origins=' + "Portland" + '&destinations=' + "Chicago" +"&key=" + destinationKey, function(response) {
    //  console.log(response);
    // });


    var origin1 = $("#origin").val();
    var destinationA = $("#destination").val();

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(Date.now() + 1000),
          trafficModel: "optimistic"
        },
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, callback);

    function callback(response, status) {
      console.log(JSON.stringify(response));
    }
  
  });

});
