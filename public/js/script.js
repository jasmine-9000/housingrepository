
let map;
function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.031 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 37.3161984, lng: -122.0050944 },
    });


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
        console.log("Your browser isn't that good; consider upgrading.")
    }
 
    
}

function userLocationRejected(error) {
    console.log("Error detected; going to toast")
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("permission denied");
            generateToast({message: "Permission Denied"})
            //alert("Permission denied.")
        break;
        case error.POSITION_UNAVAILABLE:
            // alert("Position unavailable")
        break;
        case error.TIMEOUT:
            // alert("The request to get user location timed out.")
        break;
        case error.UNKNOWN_ERROR:
            // alert("An unknown error occurred.")
        break;
    }
}
let toastContainer;

function generateToast({
    message,
    background= '#00214d', 
    color= 'FFFFFE',
    length= '3000ms'
}) {
    let newToast = document.createElement('p');
    let newToastText = document.createTextNode(message);
    newToast.classList.add('toast');
    newToast.style.animationDuration = length;

    //newToast.innerHTML = `<p class="toast" style="background-color: ${background}; color: ${color}; animation-duration: ${length}>${message}</p>`
    newToast.appendChild(newToastText)
    toastContainer.appendChild(newToast);
    //toastContainer.insertAdjacentHTML('beforeend', `<p class="toast" style="background-color: ${background}; color: ${color}; animation-duration: ${length}>${message}</p>`)
}

(function initToast() {
    document.body.insertAdjacentHTML('afterbegin', `<div class="toast-container"></div> <style>
  
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1.5rem;
      display: grid;
      justify-items: end;
      gap: 1.5rem;
    }
    
    .toast {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
      padding: 0.5em 1em;
      background-color: lightblue;
      animation: toastIt 3000ms cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
    }
    
    @keyframes toastIt {
      0%,
      100% {
        transform: translateY(-150%);
        opacity: 0;
      }
      10%,
      90% {
        transform: translateY(0);
        opacity: 1;
      }
    }
      </style>`);
    toastContainer = document.querySelector('.toast-container');
})()

// Initialize and add the map
window.initMap = initMap;


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