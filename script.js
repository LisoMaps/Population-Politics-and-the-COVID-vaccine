//collapsible div
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

//make map container
var map = L.map("map", {
  center: [39.8283, -98],
  zoom: 5,
});

// add basemap
L.tileLayer.provider("CartoDB.PositronNoLabels").addTo(map);

//make info div
var infoCounties = L.control();
infoCounties.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

//update the control based on feature properties passed
infoCounties.update = function (props) {
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
      " of the population is fully vaccinated " +
      "</b><br /><br />" +
      "This county voted majority " +
      "<h2 style = 'color: " +
      props.elecVaxData_voteColor +
      ";'>" +
      props.elecVaxData_full +
      "</h3>" +
      " in the 2020 Presidential election"
    : "Hover over a county";
};
infoCounties.addTo(map);

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
  infoCounties.update(layer.feature.properties);
}

//reset the hightlighted counties on mouseout
function resetHighlight(e) {
  geojsonCounties.resetStyle(e.target);
  infoCounties.update();
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
    weight: 0.25,
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
      '| <a href="https://www.census.gov/geographies/reference-files/time-series/demo/metro-micro/delineation-files.html">Population classes</a> | <a href="https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-County/8xkx-amqh/data">Election data</a> | <a href="https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-County/8xkx-amqh/data">Vaccine data</a> | Map: <a href="https://weircf.wixsite.com/e-portfolio">Chip Weir</a>',
  })
  .addTo(map);

//add a state borders pane
map.createPane("bordersPane");
map.getPane("bordersPane").style.zIndex = 600;

//the style for stateborders
function borders(feature) {
  return {
    weight: 2.5,
    opacity: 1,
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
