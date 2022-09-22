// Initialize and add the map
function initMap() {
// The location of Uluru
const uluru = { lat: -25.344, lng: 131.031 };
// The map, centered at Uluru
const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
});
const GeoloactionObj = navigator.geolocation;

GeoloactionObj.getCurrentPosition(function(geolocationposition) {
    console.log('hello');
    console.log(geolocationposition);
    const marker2 = new google.maps.Marker({
        position: {
            lat: geolocationposition.coords.latitude,
            lng: geolocationposition.coords.longitude
        },
        map: map,
    });


})

// The marker, positioned at Uluru
const marker = new google.maps.Marker({
    position: uluru,
    map: map,
});
}

window.initMap = initMap;