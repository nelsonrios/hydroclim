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

library(parallel)
cl.cores <- detectCores()


drv <- dbDriver("PostgreSQL")
con <- dbConnect(drv, dbname = "Test", host = "localhost", port = 5432, user = "postgres", password = 42424242 )

setwd(root_shapefiles)

basin_info_dat <- read.csv("basinlist.csv", sep = ",", header = T )
colnames(basin_info_dat) <- c("basin_id", "basin_name", "description")
basin_info_dat <- data.frame(basin_info_dat)
basin_ids <- basin_info_dat$basin_id

#loop every observed output file under each basin folder and fetch areakkm2, flow_out, wtmp out into csv files.
#for (basin_id in basin_ids){
obsprocessrch <- function(basin_id){  
  basin_name <- trimws(basin_info_dat[basin_id,2])
  print(basin_info_dat[basin_id,2])
  setwd(paste(root_shapefiles,basin_name,"/Historical/",sep=""))
  
  dat <- read.csv("output.rch", sep = "", skip = 9, header = F )
  rchData <- dat[c(2, 4, 5, 7, 51)]
  colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
  monthdat <- subset(rchData, MON <= 12)
  
  shape <- readOGR(paste(root_shapefiles,basin_name,"/GIS_data/Reach/Reach.shp"))
  len <- length(shape)
  
  joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
  shape@data <- joined
  
    
  totalCount <- 1
  
  pointCount <- 1
  totalPoints <- len #totally numners of rows in reach shapefiles
  
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
  write.csv(monthdat, file=paste(basin_name,"observerd_monthlyData.csv"))
  return(monthdat)
}

rcpprocessrch <- function(basin_id){  
  basin_name <- trimws(basin_info_dat[basin_id,2])
  print(basin_info_dat[basin_id,2])
  setwd(root_shapefiles,basin_name,sep="")
  
  
  shape <- readOGR(paste(root_shapefiles,basin_name,"/GIS_data/Reach/Reach.shp"))
  len <- length(shape)
  
  
  model_info_dat <- read.csv("model_info.csv", sep = ",", header = T )
  model_info_dat <- data.frame(model_info_dat)
  model_45ids <- model_info_dat[which(model_info_dat$model_id == 1)]
  model_85ids <- model_info_dat[which(model_info_dat$model_id == 2)]
  
  #RCP 4.5
  for(model_id in model_45ids){
    model_name <- trimws(model_info_dat[model_id,2])

    dat <- read.csv(paste(root_shapefiles,basin_name,"/RCP_4.5/",model_name,"/",model_name,".shp"), sep = "", skip = 9, header = F )
    rchData <- dat[c(2, 4, 5, 7, 51)]
    colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
    monthdat <- subset(rchData, MON <= 12)
    
    joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
    shape@data <- joined
    
    
    totalCount <- 1
    
    pointCount <- 1
    totalPoints <- len #totally numners of rows in reach shapefiles
    
    yearCount <- 1
    totalYears <- 150
    
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
    write.csv(monthdat, file=paste(basin_name,"_RCP_4.5_",model_name,"_monthlyData.csv"))
  }
  
  #RCP 8.5
  for(model_id in model_85ids){
    model_name <- trimws(model_info_dat[model_id,2])
    
    dat <- read.csv(paste(root_shapefiles,basin_name,"/RCP_8.5/",model_name,"/",model_name,".shp"), sep = "", skip = 9, header = F )
    rchData <- dat[c(2, 4, 5, 7, 51)]
    colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
    monthdat <- subset(rchData, MON <= 12)
    
    joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
    shape@data <- joined
    
    
    totalCount <- 1
    
    pointCount <- 1
    totalPoints <- len #totally numners of rows in reach shapefiles
    
    yearCount <- 1
    totalYears <- 150
    
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
    write.csv(monthdat, file=paste(basin_name,"_RCP_8.5_",model_name,"_monthlyData.csv"))
  }
  
  #return(monthdat)
}
  
system.time({
  ids <- basin_info_dat$basin_id
  cl <- makeCluster(4) # inital 4 cores clusters
  results <- parLapply(cl, ids, obsprocessrch)
  res.df <- do.call('rbind', results)
  
  #results <- parLapply(cl, ids, rcpprocessrch)
  #res.df <- do.call('rbind', results)
  
  stopCluster(cl)
})
  

  
##WRITE MONTHLY DATA TO POSTGRES
#  monthdat <- read.csv(paste(root_shapefiles,basin_name,"observerd_monthlyData.csv"))
#  monthdat <- monthdat[c(2, 4, 5, 6, 8)]
#  colnames(monthdat)[5] <- "record_month_year_id"
#  names(monthdat) <- tolower(names(monthdat))
#  monthdat$Id <- seq.int(nrow(monthdat))
#  monthdat$If_observed <- FALSE; # add observed flag
#  monthdat$model_id <- NA; # set model is as NA
#  res <- dbWriteTable(con, "reach_data", 
#               value = monthdat, append = TRUE, row.names = FALSE)
#  print(res)



