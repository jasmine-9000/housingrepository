function geocode(e) {
    e = e.trim(' '); // trim whitespace on input. no blank searches plz.
    console.log(e);
    if(e === '') return; // search cannot be blank.
    const URL = `/maps/geocode/${e.replaceAll(' ', '+')}`
    console.log(URL);
    // `https://maps.googleapis.com/maps/api/geocode/json?address=${e.replace(' ', '+')}&key=`
    fetch(URL)
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(data => {
            console.log(data);
            if(data.status === 'OK') {
                data.results.forEach((result) => {
                    createMapsAddressCard(result);
                })
            } else if (data.status === 'ZERO_RESULTS') {
                generateToast({message: 'Zero results', type: 'error'})
            } else if (data.status === 'INVALID_REQUEST') {
                generateToast({message: 'Invalid input', type: 'error'})
            } else {
                throw "Google maps error."
            }
        })
        .catch(err => {
            console.log(err);
            generateToast({message: 'Error on google maps search. Check browser console for details..', type: 'error'})
        })
    if(document.getElementById('googlemapsaddresses').classList.contains('hidden')) {
        togglemapsaddresses();
    }
}
function addaddress({
    displayname, 
    latitude= 0,
    longitude=0
}) {
    document.getElementById('address').value = displayname
    document.getElementById('latitude').value = latitude
    document.getElementById('longitude').value = longitude
    togglemapsaddresses();
    clearaddresses();
}
function clearaddresses() {
    const a = document.getElementById('googlemapsaddresses').childNodes;
    [...a].forEach(address => {
        address.remove()
    })
}
function togglemapsaddresses() {
    document.getElementById('googlemapsaddresses').classList.toggle('hidden');
}
function createMapsAddressCard(item) {
    console.log(item)
    let f_address = item.formatted_address;
    const newItem = document.createElement('li');
    newItem.innerHTML = `<li class="bg-blue-500" onclick="addaddress({displayname: '${f_address}', longitude: ${item.geometry.location.lng}, latitude:  ${item.geometry.location.lat}})">${f_address}</li>`
    document.getElementById('googlemapsaddresses').appendChild(newItem);
}