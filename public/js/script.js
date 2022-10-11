
var map; // Map HAS to be a global variable.
function initMap() {
    // The map, centered at bay area
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 37.3161984, lng: -122.0050944 },
    }); 
}

function showUserLocation() {
    // get geolocation of current user if available.
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(geolocationposition) {
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
        }, userLocationRejected)
    } else { 
        generateToast({message: "Your browser isn't that good; consider upgrading.", type:"danger"})
    }
}


function userLocationRejected(error) {
    console.log("Error detected; going to toast")
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("permission denied");
            generateToast({message: "User position: Permission Denied"})
            //alert("Permission denied.")
        break;
        case error.POSITION_UNAVAILABLE:
            generateToast({message: "User position: Position Unavailable."})
            // alert("Position unavailable")
        break;
        case error.TIMEOUT:
            generateToast({message:"The request to get user location timed out."})
            // alert("The request to get user location timed out.")
        break;
        case error.UNKNOWN_ERROR:
            generateToast({message: "An unknown error occurred."})
            // alert("An unknown error occurred.")
        break;
    }
}

// the readmore button for comments longer than 250 characters.
function readmore(e) {
    /*console.log(e) */
    let elipsis = e.previousElementSibling
    let restofcomment = e.nextElementSibling;
    /*
    console.log(elipsis)
    console.log(restofcomment)
    */
    elipsis.classList.toggle('hidden');
    e.classList.toggle('hidden')
    restofcomment.classList.toggle('hidden');

}   

// Initialize and add the map
window.initMap = initMap;