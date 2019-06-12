require(rgdal)
require(rpostgis)
library(rgdal)
#basin_name <- trimws(basin_info_dat[basin_id,2])
#print(basin_info_dat[basin_id,2])
root_shapefiles <- "C:/Hydroclim_data_frombox/"
setwd(paste(root_shapefiles,"Apalachicola River Basin","/Historical/",sep=""))

require(foreach)
require(doSNOW) 

  
  dat <- read.csv("output.rch", sep = "", skip = 9, header = F )
  rchData <- dat[c(2, 4, 5, 7, 51)]
  colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
  monthdat <- subset(rchData, MON <= 12)
  
  print(paste(root_shapefiles,"Apalachicola River Basin","/Historical/",sep=""))
  
  shape <- readOGR("C:/Hydroclim_data_frombox/Apalachicola River Basin/GIS_data/Reach/Reach.shp")
  len <- length(shape)
  
  joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
  shape@data <- joined
  
  system.time({
    #ids <- basin_info_dat$basin_id
    cl <- makeCluster(4) # inital 4 cores clusters
    registerDoSNOW(cl)  
  totalCount <- 1
  
  pointCount <- 1
  totalPoints <- len #totally numners of rows in reach shapefiles
  
  yearCount <- 1
  totalYears <- 50
  
  monthCount <- 1
  currentYear <- 1950
  yearMonthCount<-1
  countout <- data.frame()
  for(yearCount in 1: totalYears){
    foreach(monthCount = 1:12) %do% {
     out <- foreach (pointCount = 1:len, .combine= "rbind")  %dopar% {
        data.frame(YEAR=currentYear, YearMonthId = yearMonthCount)
        #monthdat[totalCount,"YEAR"] <- currentYear;
        #monthdat[totalCount,"YearMonthId"] <- yearMonthCount;
        #totalCount <- totalCount+1;
     }
     
     countout <- rbind(countout,out)
      yearMonthCount <- yearMonthCount +1;
    }
    currentYear <- currentYear+1;
  }
  countout$index = seq.int(nrow(countout))
  monthdat$index = seq.int(nrow(monthdat))
  result <- merge(monthdat, countout, by.x="index", by.y="index")
  #results <- parLapply(cl, 1, processrch)
  #res.df <- do.call('rbind', results)
  
  write.csv(monthdat, file=paste("Apalachicola River Basin_","observerd_monthlyData.csv"))
  stopCluster(cl)
})
  
