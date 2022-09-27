
function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.031 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: 37.3161984, lng: -122.0050944 },
    });
    console.log(locationsArray)
    /*google.maps.LatLngLiteral*/
    let markersArray = []
    locationsArray.forEach((location, index) => {
        console.log("Location #", index);
        console.log("Position being marked...: ")
        const position = new google.maps.LatLng(Number(location.latitude),Number(location.longitude))/* {
            lat: Number(location.latitude),
            lng: Number(location.longitude)
        } */
        console.log(position);
        console.log(typeof position.lat)
        console.log(typeof position.lng)
        markersArray[index] = new google.maps.Marker({
            postition: position, 
            map: map,
            zIndex: index
        })
    })
    markersArray.forEach(marker => {
        marker.setMap(map);
    })
    console.log(markersArray)
    

    // get geolocation of current user.
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
            title: "My Location"
        });
    })

    // The marker, positioned at Uluru
    /*
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
*/
    const NASA = { lat: 38.88318597816269, lng: -77.01645026354733 }
    var marker3 = new google.maps.Marker({
        postition: NASA, 
        map: map,
        title: "NASA"
    })
    
    console.log("NASA: ")
    console.log(marker3);
}

// Initialize and add the map
window.initMap = initMap;
