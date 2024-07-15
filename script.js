const initialCenter = [39, -98];
const initialZoom = 5;

// make map container
var map = L.map("map", {
  center: initialCenter,
  zoom: initialZoom,
});

// Add event listener for the reset view button
document.querySelector('.resetView').addEventListener('click', function() {
  map.setView(initialCenter, initialZoom);
});

// add basemap
L.tileLayer.provider("CartoDB.PositronNoLabels").addTo(map);

// make info div
var activeCounty = L.control();

activeCounty.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

//update the control based on feature properties passed
activeCounty.update = function (props) {
  this._div.innerHTML = props
    ? "<b style = 'color: " +
      props.elecVaxData_outlineColor +
      ";'>" +
      props.elecVaxData_county +
      ", " +
      props.elecVaxData_Recip_State +
      "</b></b><br />" +
      "<b style = 'color: " +
      props.elecVaxData_color +
      ";'>" +
      props.elecVaxData_PopClass +
      " (" +
      props.elecVaxData_TotalPop +
      " people)" +
      "</b><br /><b style = 'color: " +
      props.elecVaxData_outlineColor +
      ";'>" +
      props.elecVaxData_Series_Complete_Pop_Pct +
      "</b>" +
      " of the population is fully vaccinated" +
      "</b><br>" +
      "<b style = 'color: " +
      props.elecVaxData_voteColor +
      ";'>" +
      props.elecVaxData_full +
      "</b>" +
      " majority vote"
    : "Hover over a county";
};

activeCounty.addTo(map);

//zoom to county
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

//highlight county
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    opacity: 1,
    color: "#272727",
  });
  layer.bringToFront();
  activeCounty.update(layer.feature.properties);
}

//reset the hightlighted counties on mouseout
function resetHighlight(e) {
  geojsonCounties.resetStyle(e.target);
  activeCounty.update();
}

//add these events to the layer object
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    click: zoomToFeature,
    mouseout: resetHighlight,
  });
}

//the style for counties
function counties(feature) {
  return {
    weight: 0.30,
    opacity: 1,
    color: "#272727",
    fillOpacity: 1,
    fillColor: feature.properties.elecVaxData_color,
  };
}

//add county geojson
var geojsonCounties = L.geoJson

.ajax("data/counties.geojson", {
    style: counties,
    onEachFeature: onEachFeature,
    attribution:
      '| <a href="https://www.census.gov/geographies/reference-files/time-series/demo/metro-micro/delineation-files.html" target="_blank">Population classes</a> | <a href="https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-County/8xkx-amqh/data" target="_blank">Vaccine data</a> | Map: <a href="https://lisomaps.github.io/web-portfolio/" target="_blank">Chip Weir</a>',
})

.addTo(map);

//add a state borders pane
map.createPane("bordersPane");
map.getPane("bordersPane").style.zIndex = 600;

//the style for stateborders
function borders() {
  return {
    weight: 1.5,
    opacity: 0.75,
    fillOpacity: 0,
    interactive: false,
    color: "#272727",
  };
}

// add state borders
var stateborders = L.geoJson

  .ajax("data/us_states.geojson", {
    style: borders,
    pane: "bordersPane",
  })
  .addTo(map);

// add basemap labels
map.createPane("baselabels");

map.getPane("baselabels").style.zIndex = 1000;

L.tileLayer
  .provider("CartoDB.PositronOnlyLabels", {
    pane: "baselabels",
    interactive: false,
  })
  .addTo(map);

// add scale bar
L.control.scale({ position: "bottomright" }).addTo(map);

// collapsible legend
document.addEventListener("DOMContentLoaded", function() {
  var button = document.querySelector(".collapsible");
  var content = document.querySelector("#legend .content");

  // Expand the legend on page load
  button.classList.add("active");
  content.style.display = "block";
  content.style.maxHeight = content.scrollHeight + "px";

  // Set a timeout to collapse the legend after a short delay
  setTimeout(function() {
    button.classList.remove("active");
    content.style.maxHeight = null;
  }, 1); // Adjust the delay (in milliseconds) as needed

  // Set a timeout to open the legend after a short delay
  setTimeout(function() {
    button.classList.add("active");
    content.style.display = "block";
    content.style.maxHeight = content.scrollHeight + "px";
  }, 1); // Adjust the delay (in milliseconds) as needed

  button.addEventListener("click", function() {
    this.classList.toggle("active");

    if (content.style.display === "block") {
      content.style.display = "none";
      content.style.maxHeight = null;
    } else {
      content.style.display = "block";
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});