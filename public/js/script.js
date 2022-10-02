
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
    // <div class="ml-3 text-sm font-normal">Item moved successfully.</div>

    let newToastText = document.createElement('div');
    newToastText.classList.add('toast-text');
    newToastText.innerText = message;

    newToast.classList.add('toast');
    newToast.style.animationDuration = length;

    //newToast.innerHTML = `<p class="toast" style="background-color: ${background}; color: ${color}; animation-duration: ${length}>${message}</p>`
   
    /*
    <div class="checkmark-toast">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Check icon</span>
            </div>
    */
    let checkmark = document.createElement('div');
    checkmark.classList.add('checkmark-toast');
    let svg = document.createElement('svg');
    svg.innerHTML = '<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
    checkmark.appendChild(svg);
    let spanSR = document.createElement('span');
    spanSR.innerText = 'Check icon'
    spanSR.classList.add('sr-only');
    checkmark.appendChild(spanSR); 

    /*
    <button type="button" class="toast-close-button" data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
    */
    let closeButton = document.createElement('button');
    closeButton.classList.add('toast-close-button');
    closeButton.dataset.dismisstarget = "#toast-success"
    closeButton.ariaLabel="Close"
    let closeSpanSR = document.createElement("span");
    closeSpanSR.classList.add('sr-only');
    closeSpanSR.innerText = "Close";
    let closeSVG = document.createElement("svg");
    closeSVG.innerHTML = '<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
    closeButton.appendChild(closeSpanSR);
    closeButton.appendChild(closeSVG);

    newToast.appendChild(checkmark);
    newToast.appendChild(newToastText)
    newToast.appendChild(closeButton);

    toastContainer.appendChild(newToast);
    
    let timerLength = Number(length.substring(0, length.length - 2))
    console.log(timerLength)
    // remove toast element after 3100ms (or 100ms after given length.)
    setTimeout((e)=> {
        newToast.remove()
        newToastText.remove()
        console.log("Toast managed.")
    },timerLength + 100)
}

(function initToast() {
    document.querySelector('#toast-container').insertAdjacentHTML('afterbegin', `<style>
  
    #toast-container {
      position: fixed;
      top: 6rem;
      right: 1.5rem;
      display: grid;
      justify-items: end;
      gap: 1.5rem;
      z-index: 2;
    }
    
    .toast {
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
    toastContainer = document.querySelector('#toast-container');
})()

// Initialize and add the map
window.initMap = initMap;