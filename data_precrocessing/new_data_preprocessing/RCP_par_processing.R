require(rgdal)
require(rpostgis)
library(rgdal)
#basin_name <- trimws(basin_info_dat[basin_id,2])
#print(basin_info_dat[basin_id,2])
root_shapefiles <- "H:/Delaware/"
#setwd(paste(root_shapefiles,"Apalachicola River Basin/RCP-4.5/bcc-csm1-1/",sep=""))
setwd(root_shapefiles)




require(foreach)
require(doSNOW) 

drv <- dbDriver("PostgreSQL")
con <- dbConnect(drv, dbname = "t2", host = "localhost", port = 5432, user = "postgres", password = "891104" )


modelfilename <- "1_access1-0-rcp45"
dat <- read.csv(paste("H:/Delaware/RCP-4.5/",modelfilename,"/output.rch",sep=""), sep = "", skip = 9, header = F )
rchData <- dat[c(2, 4, 5, 7, 51)]
colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
monthdat <- subset(rchData, MON <= 12)


shape <- readOGR("H:/Delaware/GIS_file/river.shp")
len <- length(shape)

joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
shape@data <- joined

system.time({
  #ids <- basin_info_dat$basin_id
  cl <- makeCluster(8) # inital 4 cores clusters
  registerDoSNOW(cl)  
  totalCount <- 1
  
  pointCount <- 1
  totalPoints <- len #totally numners of rows in reach shapefiles
  
  yearCount <- 1
  totalYears <- 150
  
  monthCount <- 1
  currentYear <- 1950
  currentMonth<-1
  yearMonthCount<-1
  
  countout <- data.frame()
  for(yearCount in 1: totalYears){
    currentMonth<-1
    foreach(monthCount = 1:12) %do% {
      out <- foreach (pointCount = 1:len, .combine= "rbind")  %dopar% {
        data.frame(YEAR=currentYear, MONTH = currentMonth,YearMonthId = yearMonthCount)
        #monthdat[totalCount,"YEAR"] <- currentYear;
        #monthdat[totalCount,"YearMonthId"] <- yearMonthCount;
        #totalCount <- totalCount+1;
      }
      
      countout <- rbind(countout,out)
      yearMonthCount <- yearMonthCount +1;
      currentMonth <- currentMonth + 1;
    }
    currentYear <- currentYear+1;
  }
  countout$index = seq.int(nrow(countout))
  monthdat$index = seq.int(nrow(monthdat))
  result <- merge(monthdat, countout, by.x="index", by.y="index")
  #results <- parLapply(cl, 1, processrch)
  #res.df <- do.call('rbind', results)
  
  stopCluster(cl)
})
#write.csv(result, file=paste("Satilla_and_Altamaha_river_","observerd_monthlyData_1_access1-0-rcp45.csv"))

#monthdat <- read.csv("H:/Satilla_and_Altamaha_river_NIMA/Satilla_and_Altamaha_river_ observerd_monthlyData_1_access1-0-rcp45.csv")

write.csv(countout, file="yearmonthId.csv",row.names = FALSE)

monthdat <- result[c(2,4,5,6,9)]
colnames(monthdat)[5] <- "record_month_year_id"

names(monthdat) <- tolower(names(monthdat))
#monthdat$Id <- seq.int(nrow(monthdat))
monthdat$is_observed <- FALSE; # add observed flag
monthdat$model_id <- 1; # set model 
monthdat$basin_id <- 8;
#monthdat <- monthdat[c(1,2,3, 4, 5, 7,8,9)]
write.csv(monthdat, file=paste(modelfilename,".csv",sep=""),row.names = FALSE)

res <- dbWriteTable(con, "reach_data", 
                    value = monthdat, append = TRUE, row.names = FALSE)


setwd(root_shapefiles)
espg <- "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"

#dbBegin(con)
mobile <- readOGR("H:/Satilla_and_Altamaha_river_NIMA/GIS_files/river.shp")
mobile <- spTransform(mobile, espg)
mobile@data$basin_id <- 24;
result <- pgInsert(con, "reach", mobile)

