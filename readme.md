# Population, Politics, and the COVID Vaccine

#### Supplemental web map for this [Bloomberg article](https://www.bloomberg.com/news/articles/2021-10-04/local-vaccine-rates-mirror-class-and-density-divides)

---

This project aims to evaluate the geographic variation in the percent of people per county that are fully vaccinated, the voting outcome of the 2020 Presidential election, and county population class (metro, micro, rural).

County population vaccine percentage data were downloaded from the [CDC](https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-County/8xkx-amqh/data), 2020 Presedential election data were downloaded from a [public repository](https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-County/8xkx-amqh/data), and county population data were downloaded from the [Census Bureau](https://www.census.gov/geographies/reference-files/time-series/demo/metro-micro/delineation-files.html). These three datasets were merged together and mutated in R and then joined with a shapefile in QGIS. That shapefile was then coverted into a GeoJSON so it could be used in the web map. The web map was made primarily with Leaflet, and jQuery. The map legend was made in a layout page in ArcPro.

Lower percentages of vaccination are displayed in red and orange, while higher percentages of vaccination are shown in blue and green.

Each county's population class is shown as a function of transparency (alpha), metro counties being 0% transparent, micro counties being 50% transparent, and rural counties being 80% transparent.

County election results appear in the updating info panel as either Democratic or Republican.
