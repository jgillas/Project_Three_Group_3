
  let stateCoords = [
    { state: 'Alabama', lat: 32.806671, lon: -86.791130 },
    { state: 'Alaska', lat: 61.370716, lon: -152.404419 },
    { state: 'Arizona', lat: 33.729759, lon: -111.431221 },
    { state: 'Arkansas', lat: 34.969704, lon: -92.373123 },
    { state: 'California', lat: 36.116203, lon: -119.681570 },
    { state: 'Colorado', lat: 39.059811, lon: -105.311104 },
    { state: 'Connecticut', lat: 41.597782, lon: -72.755371 },
    { state: 'Delaware', lat: 39.318523, lon: -75.507141 },
    { state: 'District of Columbia', lat: 38.9072, lon: -77.0369 },
    { state: 'Florida', lat: 27.766279, lon: -81.686783 },
    { state: 'Georgia', lat: 33.040619, lon: -83.643074 },
    { state: 'Hawaii', lat: 21.094318, lon: -157.498337 },
    { state: 'Idaho', lat: 44.240459, lon: -114.478828 },
    { state: 'Illinois', lat: 40.349457, lon: -88.986137 },
    { state: 'Indiana', lat: 39.849426, lon: -86.258285 },
    { state: 'Iowa', lat: 42.011539, lon: -93.210526 },
    { state: 'Kansas', lat: 38.526600, lon: -96.726486 },
    { state: 'Kentucky', lat: 37.668140, lon: -84.670067 },
    { state: 'Louisiana', lat: 31.169546, lon: -91.867805 },
    { state: 'Maine', lat: 44.693947, lon: -69.381927 },
    { state: 'Maryland', lat: 39.063946, lon: -76.802101 },
    { state: 'Massachusetts', lat: 42.230171, lon: -71.530106 },
    { state: 'Michigan', lat: 43.326618, lon: -84.536095 },
    { state: 'Minnesota', lat: 45.694458, lon: -93.900192 },
    { state: 'Mississippi', lat: 32.741646, lon: -89.678697 },
    { state: 'Missouri', lat: 38.456085, lon: -92.288368 },
    { state: 'Montana', lat: 46.921925, lon: -110.454354 },
    { state: 'Nebraska', lat: 41.125370, lon: -98.268082 },
    { state: 'Nevada', lat: 38.313515, lon: -117.055374 },
    { state: 'New Hampshire', lat: 43.452492, lon: -71.563896 },
    { state: 'New Jersey', lat: 40.298904, lon: -74.521011 },
    { state: 'New Mexico', lat: 34.840515, lon: -106.248482 },
    { state: 'New York', lat: 42.165726, lon: -74.948051 },
    { state: 'North Carolina', lat: 35.630066, lon: -79.806419 },
    { state: 'North Dakota', lat: 47.528912, lon: -99.784012 },
    { state: 'Ohio', lat: 40.388783, lon: -82.764915 },
    { state: 'Oklahoma', lat: 35.565342, lon: -96.928917 },
    { state: 'Oregon', lat: 44.572021, lon: -122.070938 },
    { state: 'Pennsylvania', lat: 40.590752, lon: -77.209755 },
    { state: 'Rhode Island', lat: 41.680893, lon: -71.511780 },
    { state: 'South Carolina', lat: 33.856892, lon: -80.945007 },
    { state: 'South Dakota', lat: 44.299782, lon: -99.438828 },
    { state: 'Tennessee', lat: 35.747845, lon: -86.692345 },
    { state: 'Texas', lat: 31.054487, lon: -97.563461 },
    { state: 'Utah', lat: 40.150032, lon: -111.862434 },
    { state: 'Vermont', lat: 44.045876, lon: -72.710686 },
    { state: 'Virginia', lat: 37.769337, lon: -78.170388 },
    { state: 'Washington', lat: 47.400902, lon: -121.490494 },
    { state: 'West Virginia', lat: 38.491000, lon: -80.954570 },
    { state: 'Wisconsin', lat: 44.268543, lon: -89.616508 },
    { state: 'Wyoming', lat: 42.755966, lon: -107.302490 }
  ];

  let stateDict = stateCoords.reduce((acc, stateObj) => {
    acc[stateObj.state] = { lat: stateObj.lat, lon: stateObj.lon };
    return acc;
  }, {});

  console.log(stateDict);

//   var myMap = L.map("map", {
//     center: [37.0902, -95.7129],
//     zoom: 5
//   });
  
  // Adding the tile layer
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   }).addTo(myMap);


var baseLayer = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '...'
    }
  );

var cfg = {
    radius: 20,
    maxOpacity: .8,
    latField: 'x',
    lngField: 'y',
    valueField: 'data',  
    blur: 35
};
  const url = "https://data.cdc.gov/resource/y268-sna3.json";
  
  var heatArray = [];

  d3.json(url).then(function(response) {
    console.log(response);
  
    for (var i = 0; i < 52; i++) {
        var resp = response[i];
        if (resp.state in stateDict){
            var lat = stateDict[resp.state].lat;
            var lon = stateDict[resp.state].lon;
        
            // Add the lat/lon coordinates to the heatArray
            console.log(resp.state);
            console.log(stateDict[resp.state].lon);
            heatArray.push({x:lon, y:lat, data:resp.state_births});
        }
    }});


  console.log(heatArray);
  var testData = {
    max: 5000,
    data: heatArray 
  };

  var heatmapLayer = new L.heatLayer(testData, cfg);

  var myMap = new L.Map('map', {
    center: new L.LatLng(37.0902, -95.7129),
    zoom: 4,
    layers: [baseLayer, heatmapLayer]
  });
  
//   heatmapLayer.setData(testData);
    // Create a heatmap layer using the heatArray
//     var heat = L.heatLayer(heatArray, {
//       radius: 20,
//       latField: 'x',
//       lngField: 'y',
//       valueField: 'data',  
//       blur: 35
//     }).addTo(myMap);
//   });
  
  
  //var heat = L.heatLayer(stateArray, {
  //  radius: 20,
  //  blur: 35
  //}).addTo(myMap);