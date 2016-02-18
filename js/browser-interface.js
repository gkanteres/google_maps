var destinationKey = "AIzaSyDp0QftGXRtod_pyaNZeQnMbJScGQ87F40";
// var destinationKey = "AIzaSyDEf3D-N_JjVjOPBLwpmHCna-gegi5GcDs";
var KEY = "e0aa4703629c3d46bd310eee601b23ff";
var map;
var myLatLng = {lat: -25.363, lng: 131.044};
var bounds = new google.maps.LatLngBounds();

var getMarkers = function (htmlId) {
  for (var index in htmlId) {
    var geocode = new google.maps.Geocoder;
    geocode.geocode(
      {
        address: $('#' + htmlId[index]).val()
      }, callback);
    function callback(response, status) {
      for (var i in response) {
        var myLatLng = {lat: response[i].geometry.location.lat(), lng: response[i].geometry.location.lng()};
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });
        bounds.extend(marker.position);
      }
      map.fitBounds(bounds);
    }
  }
}

// Gmaps code needs to be in $(document).ready format in order to load properly
$(function () {


  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 5
  });

  $("#current-location-btn").click(function() {
    debugger;
    var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
      }
  });

//   var infoWindow = new google.maps.InfoWindow({map: map});
//
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//
//       infoWindow.setPosition(pos);
//       infoWindow.setContent('Location found.');
//       map.setCenter(pos);
//     }, function() {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, infoWindow, map.getCenter());
//   }
//
// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//                         'Error: The Geolocation service failed.' :
//                         'Error: Your browser doesn\'t support geolocation.');
// };


  $(".map-location").submit(function(event){
    event.preventDefault();
    getMarkers(["address"]);
  })

  $(".map-destination").submit(function(event){
    event.preventDefault();
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
      getMarkers(["origin", "destination"]);
      $('#destination-result').append('<p><em>Destination: </em>' + response.destinationAddresses + '<br><em>Trip Length: </em>' + response.rows[0].elements[0].duration.text + '<br><em>Trip Distance: </em>' + response.rows[0].elements[0].distance.text + '</p>');
      console.log(response.rows[0].elements[0].duration.text)
    }

  });

});
