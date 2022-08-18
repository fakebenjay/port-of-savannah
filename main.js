/* global mapboxgl */

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVuLWpheSIsImEiOiJjbDZ6YzkzanQwMjhsM25yeGxwc290MTgwIn0.a6Yr-ZENFv914e7ImIrVIQ";


var zoomScale = d3.scaleLinear()
  .domain([200, 640])
  .range([8.4, 10.1])
  .clamp(true)
var zoomIndex = window.innerWidth < 640 ? 9.5 : 10.1

const map = new mapboxgl.Map({
  container: "savannah-map",
  style: "mapbox://styles/mapbox/light-v10", // <- more at https://docs.mapbox.com/api/maps/styles/
  center: [-81.2837187, 32.0947185], // <- [longitude, latitude]
  zoom: zoomScale(window.innerWidth)
});

// Navigation buttons //
const nav = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(nav, "top-right");

map.on('load', () => {
  map.addSource('roads', {
    'type': 'geojson',
    'data': 'roads.json'
  });

  map.addLayer({
    'id': 'roads',
    'type': 'line',
    'source': 'roads',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#373739',
      'line-width': 4
    }
  }, 'road-label');

  map.addLayer({
    'id': 'roads-inner',
    'type': 'line',
    'source': 'roads',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': {
        property: 'FULLNAME',
        type: 'categorical',
        stops: [
          ['I-95', '#faa916'],
          ['I-16', '#faa916'],
          ['I-516', '#faa916'],
          ['Jimmy DeLoach Pkwy/GA-17', '#faa916'],
          ['Jimmy DeLoach Pkwy/GA-17 Extension', 'violet']
        ]
      },
      'line-width': 1
    }
  }, 'road-label');

  map.addSource("ports", {
    type: "geojson",
    data: 'ports.json',
  });

  map.addLayer({
    id: "ports-fill",
    type: "fill",
    source: "ports",
    paint: {
      'fill-color': {
        property: 'name',
        type: 'categorical',
        stops: [
          ['Garden City Terminal', '#56a9de'],
          ['Ocean Terminal', '#56a9de'],
          ['Bryan County Megasite', '#2d7673']
        ]
      },
      'fill-opacity': .8
    },
  }, 'road-label');

  map.addLayer({
    id: "ports-line",
    type: "line",
    source: "ports",
    paint: {
      'line-color': {
        property: 'name',
        type: 'categorical',
        stops: [
          ['Garden City Terminal', '#56a9de'],
          ['Ocean Terminal', '#56a9de'],
          ['Bryan County Megasite', '#2d7673']
        ]
      },
      'line-width': 2
    },
  }, 'road-label');

  map.addSource("cities", {
    type: "geojson",
    data: 'cities.json',
  });

  map.addLayer({
    id: "cities",
    type: "fill",
    source: "cities",
    paint: {
      'fill-color': {
        property: 'NAME',
        type: 'categorical',
        stops: [
          ['Savannah', '#6ba292'],
          ['Pooler', '#654f6f'],
          ['Bloomingdale', '#ed6a5a']
        ]
      },
      'fill-opacity': .2
    },
  }, 'road-label');

  map.addSource('counties', {
    'type': 'geojson',
    'data': 'counties.json'
  });

  map.addLayer({
    'id': 'counties-line',
    'type': 'line',
    'source': 'counties',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'black',
      'line-width': 1
    }
  }, 'road-label');

  map.addLayer({
    id: "counties-fill",
    type: "fill",
    source: "counties",
    paint: {
      'fill-color': 'white',
      'fill-opacity': 0
    },
  }, 'road-label');
});

// Points Example: Recent Earthquakes //
// map.on("load", () => {
//   map.addSource("earthquakes", {
//     type: "geojson",
//     // Use a URL for the value for the `data` property.
//     data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson",
//   });
//
//   map.addLayer({
//     id: "earthquakes-layer",
//     type: "circle",
//     source: "earthquakes",
//     paint: {
//       "circle-radius": 5,
//       "circle-color": {
//         "property": "mag",
//         "stops": [
//           [0, 'yellow'],
//           [3, 'orange'],
//           [5, 'red'],
//           [7, 'darkred']
//         ]
//       },
//       "circle-opacity": 0.7,
//       "circle-stroke-color": "white",
//       "circle-stroke-width": 1
//     },
//   });
// });


// Popups for Hurricane Zones //
// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on("mousemove", "counties-fill", (e) => {
  // Change the cursor style
  map.getCanvas().style.cursor = "pointer";

  // Get mouse coordinates
  const coordinates = e.lngLat;

  // get the information from the zone we're over
  const county = e.features[0].properties.NAME;

  // Make the popup text
  const description = `<strong>${county} County</strong>`

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

// remove the popup when we leave all zones
map.on("mouseleave", "counties-fill", () => {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

map.on("mousemove", "cities", (e) => {
  // Change the cursor style
  map.getCanvas().style.cursor = "pointer";

  // Get mouse coordinates
  const coordinates = e.lngLat;

  // get the information from the zone we're over
  const city = e.features[0].properties.NAME;

  // Make the popup text
  const description = `<strong>${city}, Ga.</strong>`

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

// remove the popup when we leave all zones
map.on("mouseleave", "cities", () => {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

map.on("mousemove", "roads", (e) => {
  // Change the cursor style
  map.getCanvas().style.cursor = "pointer";

  // Get mouse coordinates
  const coordinates = e.lngLat;

  // get the information from the zone we're over
  const road = e.features[0].properties.FULLNAME;

  // Make the popup text
  const description = `<strong>${road}</strong>`

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

// remove the popup when we leave all zones
map.on("mouseleave", "roads", () => {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

map.on("mousemove", "roads-inner", (e) => {
  // Change the cursor style
  map.getCanvas().style.cursor = "pointer";

  // Get mouse coordinates
  const coordinates = e.lngLat;

  // get the information from the zone we're over
  const road = e.features[0].properties.FULLNAME;

  // Make the popup text
  const description = `<strong>${road}</strong>`

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

// remove the popup when we leave all zones
map.on("mouseleave", "roads-inner", () => {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

map.on("mousemove", "ports-fill", (e) => {
  // Change the cursor style
  map.getCanvas().style.cursor = "pointer";

  // Get mouse coordinates
  const coordinates = e.lngLat;

  // get the information from the zone we're over
  const port = e.features[0].properties.name;

  // Make the popup text
  const description = `<strong>${port}</strong>`

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
});

// remove the popup when we leave all zones
map.on("mouseleave", "ports-fill", () => {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

map.moveLayer('cities', 'counties-fill', 'counties-line')
map.moveLayer('roads', 'roads-inner')
map.moveLayer('ports-fill')