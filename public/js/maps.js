async function getLocationsArray() {
    await fetch();
    return []
}

function createLocations() {
    return fetch(`/maps5/coordinates/-76.77/39.108/20000`)
            .then(response => {
                console.log(response);
                return response.json()
            })
            .then(data=>processlocations(data))
            .catch(err => {
                console.log(err);
                throw err;
            });
}

function processlocations(data) {
    console.log(data);
    data.forEach(element => {
        console.log(element)
        console.log(element.options)
        let marker = new google.maps.Marker({
            position: {
                // MongoDB stores latitude and longitude differently.
                lat: element.location.coordinates[1],
                lng: element.location.coordinates[0]
            },
            map: map,
            title: element.name
        })
        let infoWindow = generateWindow(element);
        
        /*(new google.maps.InfoWindow({
            content: `<h1>${element.name}</h1>`

        })*/
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        })
    });
    /*
    let marker1 = new google.maps.Marker({
        position: {
            lat: data[0].location.coordinates[0],
            lng: data[0].location.coordinates[1]
        },
        map: map,
        title: data[0].name
    });
    */
}

function generateWindow(element) {
    let infoWindow = new google.maps.InfoWindow({
        content: `
                    <a href='/happyHome/noauth/${element._id}'>
                    <h1 class="text-xl">${element.name}</h1>
                    <p class="text-lg">Address: ${element.address}</p>
                    </a>
                    `
    })
    return infoWindow
}