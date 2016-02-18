var destinationKey = "AIzaSyDp0QftGXRtod_pyaNZeQnMbJScGQ87F40";
// var destinationKey = "AIzaSyDEf3D-N_JjVjOPBLwpmHCna-gegi5GcDs";
var KEY = "e0aa4703629c3d46bd310eee601b23ff";
var map;
var myLatLng = {lat: -25.363, lng: 131.044};
var bounds = new google.maps.LatLngBounds();
var markers = [];

var getMarkers = function (htmlId) {
  for (var index in htmlId) {
    var geocode = new google.maps.Geocoder();
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
        });
        markers.push(marker);
        bounds.extend(marker.position);
      }
      map.fitBounds(bounds);
    };
  }
};

var clearMarkers = function() {
  for (var i in markers) {
    markers[i].setMap(null);
  }
};

var currentLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
      });
      markers.push(marker);
      map.setCenter(pos);
      map.setZoom(14);
    }, function() {
    });
  }
};

var getDirection = function() {
  var theRout = new google.maps.DirectionsService();
  theRout.route(
  origin:  markers[0].position,//| String | google.maps.Place,
  destination: markers[1].position; //| String | google.maps.Place,
//   travelMode: google.maps.TravelMode.DRIVING,
// //   transitOptions: {
// //   arrivalTime: Date,
// //   departureTime: Date,
// //   modes[]: TransitMode,
// //   routingPreference: TransitRoutePreference
// // },
//   provideRouteAlternatives: true,
//   avoidHighways: false,
//   avoidTolls: false;
)};

// Gmaps code needs to be in $(document).ready format in order to load properly
$(function () {


  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 5
  });

  $("#current-location-btn").click(function() {
    debugger;
    currentLocation();
  });

  $(".map-location").submit(function(event){
    clearMarkers();
    event.preventDefault();
    // for (map.markers)
    getMarkers(["address"]);
  });

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
      console.log(response.rows[0].elements[0].duration.text);
    }
    getDirection();
  });

});
