async function getLocationsArray() {
    await fetch();
    return []
}

async function createLocations() {
    await fetch(`${PROTOCOL + HOSTNAME + ':' + PORT}/maps/coordinates/-76.77/39.108/20000`)
            .then(response => {
                console.log(response);
                return response.json()
            })
            .then(data=>processlocations(data))
            .catch(err => {
                console.log(err);
            });
}

function processlocations(data) {
    console.log(data);
    data.forEach(element => {
        let marker = new google.maps.Marker({
            position: {
                // MongoDB stores latitude and longitude differently.
                lat: element.location.coordinates[1],
                lng: element.location.coordinates[0]
            },
            map: map,
            title: element.name
        })
        let infoWindow = new google.maps.InfoWindow({
            content: `<h1>${element.name}</h1>`

        })
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