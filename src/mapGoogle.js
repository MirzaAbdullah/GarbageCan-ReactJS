//import { Map, GoogleApiWrapper } from 'google-maps-react';

import { defaults } from "lodash";

//haversine function to calculate the straight line distance
/* function haversine_distance(markerGarbageCan, markerTask0) {
    var R = 6371.0710; // Radius of the Earth in km
    var rlat1 = markerGarbageCan.position.lat() * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = markerTask0.position.lat() * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (markerTask0.position.lng() - markerGarbageCan.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
} */

// Initialize and add the map
export function initMap() {
    // The location of Karachi 0 milestion - I haven't found the location of garbagecan
    const garbCan = { lat: 24.860966, lng: 66.990501 };
    // Creating a new map with 15 zoom and centered on Karachis 0 milestone
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: garbCan,
    });
    //task0 location
    var task0 = { lat: 24.8535439, lng: 67.0599332 };
    // task1 location
    var task1 = { lat: 24.8263252, lng: 67.0484449 };
    //creating a marker 
    const markerGarbageCan = new google.maps.Marker({
        position: garbCan,
        map: map,
    });
    var markerTask0 = new google.maps.Marker({
        position: task0,
        map: map,
    });
    var markerTask1 = new google.maps.Marker({
        position: task1,
        map: map,
    });
    // Draw a line showing the straight distance between the markers
    var line = new google.maps.Polyline({ path: [garbCan, task1, task0], map: map });

    // Calculate and display the distance between markers
    // var distance = haversine_distance(markerGarbageCan, markerTask0);
    // document.getElementById("msg").innerHTML = "Distance between markers: " + distance.toFixed(2) + " km.";

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map); // Existing map object displays directions
    // Create route from existing points used for markers
    const route = {
        origin: garbCan,
        destination: task0,
        travelMode: 'DRIVING' // The directions service can also accept  BICYCLING, TRANSIT, and WALKING values
    }

    directionsService.route(route,
        function (response, status) { // anonymous function to capture directions
            if (status !== 'OK') {
                window.alert('Directions request failed due to ' + status);
                return;
            } else {
                directionsRenderer.setDirections(response); // Add route to the map
                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                if (!directionsData) {
                    window.alert('Directions request failed');
                    return;
                }
                else {
                    document.getElementById('msg').innerHTML += " Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").";
                }
            }
        });
}

export default{initMap}