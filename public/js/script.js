
let map;
function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.031 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: 37.3161984, lng: -122.0050944 },
    });
    /*
    const coolLocations = [
        {
            latitude: 37.41524232563237, 
            longitude: -122.06025956872777,
            title: "NASA"
        }, 
        {
            latitude: 38.89547583307576, 
            longitude: -77.05152190382638,
            title: 'CIA'
        },
        {
            latitude: 38.895818133569385, 
            longitude: -77.02507341362892,
            title: "FBI"
        },
        {
            latitude: 39.10883820540256, 
            longitude: -76.77134283081112,
            title: "NSA"
        }
    ]
    let locationsArray = coolLocations;
    let markersArray = []
    coolLocations.forEach((location, index) => {
        console.log("Location #", index);
        console.log("Position being marked...: ")
        const position =  {
            lat: Number(location.latitude),
            lng: Number(location.longitude)
        } 
        console.log(position);
        console.log(typeof position.lat)
        console.log(typeof position.lng)
        new google.maps.Marker({
            postition: position, 
            map: map,
            zIndex: index
        })
    })
    console.log(markersArray)
    */

    // get geolocation of current user.
    const GeoloactionObj = navigator.geolocation;

    GeoloactionObj.getCurrentPosition(function(geolocationposition) {
        console.log('hello');
        console.log(geolocationposition);
        let marker2 = new google.maps.Marker({
            position: {
                lat: geolocationposition.coords.latitude,
                lng: geolocationposition.coords.longitude
            },
            map: map,
            title: "My Location"
        });
        let infoWindow = new google.maps.InfoWindow({
            content: '<h1>This is your location...</h1>'

        })
        marker2.addListener('click', function() {
            infoWindow.open(map, marker2);
        })
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
