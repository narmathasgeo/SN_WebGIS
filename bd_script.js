// Create Map
const map = L.map("map").setView(
  [13.0675, 80.2056],
  17
);


// Add OpenStreetMap
const osm = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 20
  }
).addTo(map);


// Popup Function
function onEachFeature(feature, layer) {

  const props = feature.properties;

  const popupContent = `
    <strong>${props.Point_Name}</strong><br><br>

    Point Type: ${props.Point_Type}<br>
    Category: ${props.Category}<br><br>

    Description: ${props.Descriptio}
  `;

  // Add Popup
  layer.bindPopup(popupContent);

  // Add Tooltip
  layer.bindTooltip(
    props.Point_Name,
    {
      direction: "top"
    }
  );
}


// Load Location Points
fetch("data/yard_points.geojson")
  .then(response => response.json())
  .then(data => {

    // Add Points to Map
    const yardPoints = L.geoJSON(data, {

      // Small Point Marker
      pointToLayer: function(feature, latlng) {

        return L.circleMarker(latlng, {
          radius: 5,
          color: "#1f4e79",
          fillColor: "#4da6ff",
          fillOpacity: 0.9
        });

      },

      // Popup and Tooltip
      onEachFeature: onEachFeature

    }).addTo(map);


    // Get Table Body
    const tableBody =
      document.getElementById("table-body");


    // Add each GeoJSON point to the table
    data.features.forEach(function(feature) {

      const props = feature.properties;

      // Create New Row
      const row =
        document.createElement("tr");


      // Add Data to Row
      row.innerHTML = `
        <td>${props.Point_ID}</td>
        <td>${props.Point_Name}</td>
        <td>${props.Point_Type}</td>
        <td>${props.Category}</td>
        <td>${props.Descriptio}</td>
      `;


      // Add Row to Table
      tableBody.appendChild(row);

    });

  });

// Load Area Boundary
fetch("data/yard_area.geojson")
  .then(response => response.json())
  .then(data => {

    const areaBoundary = L.geoJSON(data, {
      style: {
        color: "yellow",
        weight: 3,
        fillOpacity: 0
      },

      interactive: false

    }).addTo(map);

  });

// Load Navigation Routes
fetch("data/yard_routes.geojson")
  .then(response => response.json())
  .then(data => {

    const routes = L.geoJSON(data, {

      style: {
        color: "red",
        weight: 2
      }

    }).addTo(map);

  });

// Add Scale Bar
L.control.scale(
  {
    metric: true,
    imperial: false
  }
).addTo(map);