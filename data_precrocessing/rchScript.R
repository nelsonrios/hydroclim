setwd("C:/Development/R Data")
dat <- read.csv("output.rch", sep = "", skip = 9, header = F )
rchData <- dat[c(2, 4, 5, 7, 51)] #need to change: combine cloumns by name not index
colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
monthdat <- subset(rchData, MON <= 12)


list.files(path = ".", pattern = "\\.rch$", recursive = TRUE, full.names = TRUE)
----------------------------------------
c(4)
require(foreign)
shapedb <- read.dbf("Sub-basin.dbf")



-----------------
require(rgdal)
shape <- readOGR("C:/Hydroclim_data_frombox/Mobile River Basin/GIS_data/Reach/Reach.shp")

joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
shape@data <- joined

-----------------------------------------
-----SET MONTH/YEAR FOR TEMP/FLOW DATA
-----------------------------------------



pointCount <- 1
totalCount <- 1
totalPoints <- 743

yearCount <- 1
totalYears <- 50

monthCount <- 1
currentYear <- 1950

yearMonthCount <- 1

while(yearCount <= totalYears){
	while(monthCount <= 12) {
		while (pointCount <= totalPoints) {
			monthdat[totalCount,"YEAR"] <- currentYear;
			monthdat[totalCount,"YearMonthId"] <- yearMonthCount;
			pointCount <- pointCount+1;
			totalCount <- totalCount+1;
		}
		pointCount <- 1;
		monthCount <- monthCount+1;
		yearMonthCount <- yearMonthCount +1;
	}
	yearCount <- yearCount+1;
	currentYear <- currentYear+1;
	monthCount <- 1;
}

write.csv(monthdat, file="monthlyData.csv")


write.csv(monthdat, file="temp.csv")

drv <- dbDriver("PostgreSQL")
con <- dbConnect(drv, dbname = "Test", host = "localhost", port = 5432, user = "postgres", password = 42424242 )

dbWriteTable(con, "reachMonthly", 
             value = monthdat, append = TRUE, row.names = FALSE)
			 
dbWriteDataFrame(con, "sample_table", colorado)
			 
-------------------------------------------------
-----PROCESS DATA TO ADD TEMP/FLOW TO SHAPEFILE
-------------------------------------------------
con <- dbConnect(PostgreSQL(), dbname = "Test", host = "localhost", port = 5432, user = "postgres", password = 42424242 )
dbDisconnect(con)
require(rgdal)
require(rpostgis)
library(rgdal)
library(rpostgis)
library(RPostgreSQL)

shape <- readOGR("C:/Hydroclim_data_frombox/Mobile River Basin/GIS_data/Reach/Reach.shp")
names(shape@data) <- tolower(names(shape@data))
monthdat <- read.csv("monthlyData.csv")
monthdat <- monthdat[2:8]
colnames(monthdat)[7] <- "record_month_year_id"


fileName <- '';

yearCount <- 1
totalYears <- 50
totalMonths <- totalYears*12;

monthCount <- 1
currentYear <- 1950



while(monthCount <= totalMonths){
	newShape <- shape;
	monthYearData <- subset(monthdat, record_month_year_id == monthCount);
	singleRecord <- monthYearData[1,];
	thisRCH <- singleRecord$RCH
	month <- singleRecord$MON;
	year <- singleRecord$YEAR;
	monthYearData <- monthYearData[c(1, 3, 4, 5, 7)]
	names(monthYearData) <- tolower(names(monthYearData))
	colnames(monthYearData)[4] <- "wtmpdeg"
	newShape@data <- merge(shape@data, monthYearData, by.x="objectid", by.y="rch");
	pgInsert(con, "subbasin", newShape);
	monthCount <- monthCount+1;
}		
---------------------------------------
dbWriteSpatial(con, "reach2", newShape, row.names = FALSE, append = TRUE);
writeOGR(newShape, "PG:dbname='Test' user=postgres password='42424242',host='localhost', port='5432' ", layer_options = "geometry_name=geom", 
"reach2", "PostgreSQL")
writeOGR(newShape, "PG:dbname='Test' user=postgres password='42424242',host='localhost', port='5432' ", layer_options = "geometry_name=geom","reach2", "PostgreSQL")
------------------------------------------------
------- CREATE YEAR/MONTH DATA
---------------------------------------------------
yearCount <- 1
totalYears <- 50
currentYear <- 1950
monthCount <- 1
totalCount <- 1
totalMonths <- totalYears*12;
test <- data.frame(id=NA, month=NA, year=NA)[numeric(0),]

while(totalCount <= totalMonths) {
	monthCount
	currentYear
	test[nrow(test) + 1,] = c(totalCount, monthCount, currentYear);
	monthCount <- monthCount +1;
	totalCount <- totalCount +1;
	if (monthCount > 12) {
		monthCount <- 1;
		currentYear <- currentYear + 1;
	}
}
----------------------------------------------------
-------WRITE DATA TO POSTGRES EXAMPLE
----------------------------------------------------
drv <- dbDriver("PostgreSQL")
con <- dbConnect(drv, dbname = "Test", host = "localhost", port = 5432, user = "postgres", password = 42424242 )
dbWriteTable(con, "record_month_year", 
             value = test, append = TRUE, row.names = FALSE)

------------------------------------------------------
-------WRITE MONTHLY DATA TO POSTGRES
------------------------------------------------------
monthdat <- read.csv("monthlyData.csv")
monthdat <- monthdat[c(2, 4, 5, 6, 8)]
colnames(monthdat)[5] <- "record_month_year_id"
names(monthdat) <- tolower(names(monthdat))
monthdat$Id <- seq.int(nrow(monthdat))
dbWriteTable(con, "reach_data", 
             value = monthdat, append = TRUE, row.names = FALSE)

----------------------------------------------------------
-------Get all needed files 
----------------------------------------------------------

reachFiles <- grep('Reach.shp',list.files(all.files = TRUE, 
                               full.names = TRUE, recursive = TRUE),value=TRUE) 
subbasinFiles <- grep('Sub-basin.shp',list.files(all.files = TRUE, 
                               full.names = TRUE, recursive = TRUE),value=TRUE) 
typeOf(reachFiles)


require(rgdal)
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"

setwd("C:/Development/HydroClim_Data/Mobile River Basin/Reach")
mobile <- readOGR("Reach.shp")
mobile <- spTransform(mobile, espg)
mobile@data$basin_id <- 1;
pgInsert(con, "reach", mobile);
setwd("C:/Development/HydroClim_Data/Colorado River Basin/Reach")
colorado <- readOGR("Reach.shp")
colorado <- spTransform(colorado, espg)
colorado@data$basin_id <- 2;
pgInsert(con, "reach", colorado);
setwd("C:/Development/HydroClim_Data/Apalachicola River Basin/Reach")
apalachicola <- readOGR("Reach.shp")
apalachicola <- spTransform(apalachicola, espg)
apalachicola@data$basin_id <- 3;
pgInsert(con, "reach", apalachicola);
setwd("C:/Development/HydroClim_Data/Ohio River Basin/Reach")
ohio <- readOGR("Reach.shp")
ohio <- spTransform(ohio, espg)
ohio@data$basin_id <- 4;
pgInsert(con, "reach", ohio);
setwd("C:/Development/HydroClim_Data/Sabine River Basin/Reach")
sabine <- readOGR("Reach.shp")
sabine <- spTransform(sabine, espg)
sabine@data$basin_id <- 5;
pgInsert(con, "reach", sabine);
setwd("C:/Development/HydroClim_Data/Suwannee River Basin/Reach")
suwannee <- readOGR("Reach.shp")
suwannee <- spTransform(suwannee, espg)
suwannee@data$basin_id <- 6;
pgInsert(con, "reach", suwannee);
setwd("C:/Development/HydroClim_Data/Upper Mississippi River Basin/Reach")
umiss <- readOGR("Reach.shp")
umiss <- spTransform(umiss, espg)
umiss@data$basin_id <- 7;
pgInsert(con, "reach", umiss);


--------------------------------------
----------Basins
-------------------------------------
setwd("C:/Development/HydroClim_Data/Mobile River Basin/Sub-basin")
mobile <- readOGR("Sub-basin.shp")
mobile <- spTransform(mobile, espg)
mobile@data$basin_id <- 1;
pgInsert(con, "subbasin", mobile);
setwd("C:/Development/HydroClim_Data/Colorado River Basin/Sub-basin")
colorado <- readOGR("Sub-basin.shp")
colorado <- spTransform(colorado, espg)
colorado@data$basin_id <- 2;
pgInsert(con, "subbasin", colorado);
setwd("C:/Development/HydroClim_Data/Apalachicola River Basin/Sub-basin")
apalachicola <- readOGR("Sub-basin.shp")
apalachicola <- spTransform(apalachicola, espg)
apalachicola@data$basin_id <- 3;
pgInsert(con, "subbasin", apalachicola);
setwd("C:/Development/HydroClim_Data/Ohio River Basin/Sub-basin")
ohio <- readOGR("Sub-basin.shp")
ohio <- spTransform(ohio, espg)
ohio@data$basin_id <- 4;
pgInsert(con, "subbasin", ohio);
setwd("C:/Development/HydroClim_Data/Sabine River Basin/Sub-basin")
sabine <- readOGR("Sub-basin.shp")
sabine <- spTransform(sabine, espg)
sabine@data$basin_id <- 5;
pgInsert(con, "subbasin", sabine);
setwd("C:/Development/HydroClim_Data/Suwannee River Basin/Sub-basin")
suwannee <- readOGR("Sub-basin.shp")
suwannee <- spTransform(suwannee, espg)
suwannee@data$basin_id <- 6;
pgInsert(con, "subbasin", suwannee);
setwd("C:/Development/HydroClim_Data/Upper Mississippi River Basin/Sub-basin")
umiss <- readOGR("Sub-basin.shp")
umiss <- spTransform(umiss, espg)
umiss@data$basin_id <- 7;
pgInsert(con, "subbasin", umiss);

----------------------------------------
---------Create Fake Data
----------------------------------------
rows <- nrow(colorado@data)
faked <- data.frame(matrix(ncol = 7, nrow = 0))
x <- c("id", "subbasin_id", "rch", "areakm2", "flow_outcms", "wtmpdegc", "record_month_year_id")
colnames(faked) <- x

temp <- do.call("rbind", list(mobile, colorado, apalachicola, ohio, sabine, suwannee, umiss))

dbWriteSpatial(con, "subbasin", temp, row.names = FALSE, append = TRUE);


writeOGR(temp, dsn="C:/Development/R Data", layer= "sample4", driver="ESRI Shapefile")

---------------------------------------------------
------Reproject
---------------------------------------------------
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"
test <- spTransform(mobile, espg)
test <- spTransform(mobile, CRS("+init=epsg:3857"))
library(dismo)
test <-gmap()
writeOGR(temp, dsn="C:/Development/R Data", layer= "sample4", driver="ESRI Shapefile")
-----------------------------------------------------------------


require(rgdal)
reachLength <- 
shape <- readOGR("Reach.shp")

temp <- do.call("rbind", list(mobile, colorado, apalachicola, ohio, sabine, suwannee, umiss))

dbWriteSpatial(con, "subbasin", temp, row.names = FALSE, append = TRUE);
							   
-------------------------------------------------
-----TEMP
-------------------------------------------------
require(rgdal)

shape <- readOGR("Reach.shp")
monthdat <- read.csv("monthlyData.csv")
fileName <- '';

yearCount <- 1
totalYears <- 50
totalMonths <- totalYears*12;

monthCount <- 1
currentYear <- 1950

monthYearData;
singleRecord;
month;
year;
while(monthCount <= totalMonths){
	newShape <- shape;
	monthYearData <- subset(monthdat, YearMonthId == monthCount);
	singleRecord <- monthYearData[1,];
	thisRCH <- singleRecord$RCH;
	month <- singleRecord$MON;
	year <- singleRecord$YEAR;
	fileName <- paste(thisRCH, month, year, sep="_");
	newShape@data <- merge(shape@data, monthYearData, by.x="OBJECTID", by.y="RCH");
	writeOGR(newShape, dsn="C:/Development/R Data/shpfiles", layer= fileName, driver="ESRI Shapefile")	
	monthCount <- monthCount+1;
}		
---------------------------------------------------
------- fake data
------------------------------------------------

rows <- nrow(colorado@data)
	 
monthYearCount <- 1
rowCount <- 1
totalMonthYear <- 600
totalCount <- 1
test <- data.frame(id=NA, month=NA, year=NA)[numeric(0),]

while(rowCount <= rows) {
while(monthYearCount <= totalMonthYear) {
	monthCount
	currentYear
	test[rows + 1,] = c(totalCount, monthCount, currentYear);
	monthCount <- monthCount +1;
	totalCount <- totalCount +1;
	if (monthCount > 12) {
		monthCount <- 1;
		currentYear <- currentYear + 1;
	}
}
}

---------------------------------------------------
--------demo data processing
---------------------------------------------------

require(rgdal)
require(rpostgis)
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"

setwd("C:/Development/R Data/Mobile River Basin")
mobileBasin <- readOGR("Basin.shp")
mobileBasin <- spTransform(mobileBasin, espg)
pgInsert(con, "basin_demo", mobileBasin);

mobileSubbasin <- readOGR("Sub-basin.shp")
mobileSubbasin <- spTransform(mobileSubbasin, espg)
mobileSubbasin@data$basin_id <- 1;
pgInsert(con, "subbasin_demo", mobileSubbasin);

mobileReach <- readOGR("Reach.shp")
mobileReach <- spTransform(mobileReach, espg)
mobileReach@data$basin_id <- 1;
pgInsert(con, "reach_demo", mobileReach);