const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

let myMap = L.map("map", {
    center: [38.7223, 9.1393],  // used lisbon, portugal as center due to dataset covering points across the globe
    zoom: 3,
  });

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// let raw_data = d3.json(url)
// console.log(raw_data)

// inspiration from LA monali, said my code (not used commented out at bottom) was correct but set up all wrong
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    }
  }

  function getColor(depth) {
    switch(true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default: 
        return "#98ee00";
    }
  }
  
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 2;
  }
  
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng)
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "location: " + feature.properties.place + 
        "<br> magnitude: " + feature.properties.mag + 
        "<br> depth: " + feature.geometry.coordinates[2]
      );
    }
  }).addTo(myMap);

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      let div = L.DomUtil.create('div', 'info legend');
      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = ["#ea2c2c", "#ea822c", "#ee9c00", "#eecc00", "#d4ee00", "#98ee00"];
  
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
  
  return div;
  };
  
  legend.addTo(myMap);

});

    // let feat = data.features
    // for (let i = 0; i < feat.length; i++) {
    //     let geometry = feat[i].geometry
    //     let lat = geometry.coordinates[1]
    //     let long = geometry.coordinates[0]
    //     let coords = [lat, long]
    //     let depth = geometry.coordinates[2]

    //     let properties = feat[i].properties
    //     let magnitude = properties.mag
    //     let location = properties.place
    //     let time = properties.time   // (IS THIS UNIX TIME? NEEDS CONVERSION??)
    //     let time_converted = new Date(time)

                // L.marker(coords)
                // .bindPopup(`<h2>${location}</h2>
                //             <h3>magnitude: ${magnitude}</h3>
                //             <h3>${time_converted}</h3>`)
                // .addTo(myMap);

// Loop through the cities array, and create one marker for each city object.
// for (let i = 0; i < cities.length; i++) {
//   L.circle(coords, styleInfo{
//     fillOpacity: 0.75,
//     color: "green",
//     fillColor: "purple",
//     // Setting our circle's radius to equal the output of our markerSize() function:
//     // This will make our marker's size proportionate to its population.
//     // radius: markerSize(magnitude)
//     radius: magnitude *10
//   }).bindPopup(`<h2>${location}</h2>
//                 <h3>magnitude: ${magnitude}</h3>
//                 <h3>${time_converted}</h3>`)
//                 .addTo(myMap);
// }

    // console.log(feat.length)
    // console.log(geometry)
    // console.log(lat)
    // console.log(long)
    // console.log(depth)
    // console.log(properties)
    // console.log(magnitude)
    // console.log(location)
    // console.log(time)
    // console.log(time_converted)