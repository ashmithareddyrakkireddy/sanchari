// const campground = require("../../models/campground");

mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset : 10})
        .setHTML(
            `<h4>${camp.title}</h4><h6>${camp.location}</h6>`
        )
    )
    .addTo(map);