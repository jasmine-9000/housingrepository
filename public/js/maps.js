async function getLocationsArray() {
    await fetch();
    return []
}

async function createLocations() {
    await fetch(`${PROTOCOL + HOSTNAME + ':' + PORT}/maps/coordinates/-76.77/39.108/2000`)
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
    let marker1 = new google.maps.Marker({
        position: {
            lat: data[0].location.coordinates[0],
            lng: data[0].location.coordinates[1]
        },
        map: map,
        title: data[0].name
    });
}