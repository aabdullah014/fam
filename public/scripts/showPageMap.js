mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: masjid.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);

new mapboxgl.Marker()
    .setLngLat(masjid.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 30 })
            .setHTML(
                `<h3>${masjid.name}</h3><p>${masjid.street}</p>`
            )
    )
    .addTo(map)