#---------------------------------------------------
#  --------Insert initial data in database
#---------------------------------------------------

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

##Insert basin information from basinlist.csv into database
#----------------------------------------
#-TABLE: basin_info
#----------------------------------------
#-|--id--|--name--|--description--|------
#----------------------------------------
#pwd <- getwd();
setwd("C:/Hydroclim_data_frombox")
basin_info_dat <- read.csv("basinlist.csv", sep = ",", header = T )
colnames(basin_info_dat) <- c("basin_id", "basin_name", "description")
pgInsert(con, "basin_info", basin_info_dat)


##Insert model information from basinlist.csv into database
#-------------------------------------------------------------------
#-TABLE: model_type_dat
#-------------------------------------------------------------------
#-|--model_type_id--|--model_type_name--|--description--|
#-------------------------------------------------------------------
#pwd <- getwd();
setwd("C:/Hydroclim_data_frombox")
model_type_dat <- read.csv("models_type.csv", sep = ",", header=T)
colnames(model_type_dat) <- c("model_type_id", "model_type_name","description")
pgInsert(con, "model_type",model_type_dat)
#-------------------------------------------------------------------
#-TABLE: model_info
#-------------------------------------------------------------------
#-|--model_id--|--model_name--|--model_type_id--|--description--|--
#-------------------------------------------------------------------
model_dat <- read.csv("models_RCP.csv", sep = ",", header = T )
colnames(model_dat) <- c("model_id", "model_name", "model_type_id","description")
pgInsert(con, "model", model_dat)

##Create Month/Year data
#-------------------------------------------------------------------
#-TABLE: record_month_year
#-------------------------------------------------------------------
#-|--record_month_year_id--|--month--|--year--|
#-------------------------------------------------------------------
yearCount <- 1
totalYears <- 150
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

dbWriteTable(con, "record_month_year", value = test, append = TRUE, row.names = FALSE)
