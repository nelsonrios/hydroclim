#---------------------------------------------------
#  --------Insert basin, subbasin and reach data into database
#---------------------------------------------------

root_shapefiles <- "C:/Hydroclim_data_frombox/"

#---------------------------------------------------
#-----import packages and build database Conncection-------------------------
#---------------------------------------------------
require(rgdal)
require(rpostgis)
library(rgdal)
library(rpostgis)
library(RPostgreSQL)

drv <- dbDriver("PostgreSQL")
con <- dbConnect(drv, dbname = "Test", host = "localhost", port = 5432, user = "postgres", password = 42424242 )

##Insert sub basin information from subbasin.shp into database
#----------------------------------------
#-TABLE: subbasin
#----------------------------------------
#-|--postgis column|--basin_id--|--------
#----------------------------------------
#pwd <- getwd();
setwd(root_shapefiles)
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"

basin_info_dat <- read.csv("basinlist.csv", sep = ",", header = T )
colnames(basin_info_dat) <- c("basin_id", "basin_name", "description")
basin_info_dat <- data.frame(basin_info_dat)
basin_ids <- basin_info_dat$basin_id

dbBegin(con)
tryCatch({ #try
  for (basin_id in basin_ids){
    basin_name <- trimws(basin_info_dat[basin_id,2])
    print(basin_info_dat[basin_id,2])
    setwd(paste(root_shapefiles,basin_name,"/GIS_data/Sub-basin/",sep=""))
    mobile <- readOGR("Sub-basin.shp")
    mobile <- spTransform(mobile, espg)
    mobile@data$basin_id <- basin_id;
    result <- pgInsert(con, "subbasin", mobile);
    }
  },
  #error
  error = function(cond){
    message(cond)
    dbRollback(con);
    return(NA);
  },
  finally = {
    dbCommit(con)
  }
)

#Insert basin information from subbasin.shp into database
#----------------------------------------
#-TABLE: basin
#----------------------------------------
#-|--postgis columns|--basin_id--|--------
#----------------------------------------
#pwd <- getwd();
setwd(root_shapefiles)
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"

dbBegin(con)
tryCatch({ #try
  for (basin_id in basin_ids){
    basin_name <- trimws(basin_info_dat[basin_id,2])
    print(basin_info_dat[basin_id,2])
    setwd(paste(root_shapefiles,basin_name,"/GIS_data/Basin/",sep=""))
    mobile <- readOGR("Basin.shp")
    mobile <- spTransform(mobile, espg)
    mobile@data$basin_id <- basin_id;
    result <- pgInsert(con, "basin", mobile);
  }
},
#error
error = function(cond){
  message(cond)
  dbRollback(con);
  return(NA);
},
finally = {
  dbCommit(con)
}
)

#Insert reach information from subbasin.shp into database
#----------------------------------------
#-TABLE: reach
#----------------------------------------
#-|--postgis column|--basin_id--|--------
#----------------------------------------
#pwd <- getwd();
setwd(root_shapefiles)
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"

dbBegin(con)
tryCatch({ #try
  for (basin_id in basin_ids){
    basin_name <- trimws(basin_info_dat[basin_id,2])
    print(basin_info_dat[basin_id,2])
    setwd(paste(root_shapefiles,basin_name,"/GIS_data/Reach/",sep=""))
    mobile <- readOGR("Reach.shp")
    mobile <- spTransform(mobile, espg)
    mobile@data$basin_id <- basin_id;
    result <- pgInsert(con, "reach", mobile);
  }
},
#error
error = function(cond){
  message(cond)
  dbRollback(con);
  return(NA);
},
finally = {
  dbCommit(con)
}
)

