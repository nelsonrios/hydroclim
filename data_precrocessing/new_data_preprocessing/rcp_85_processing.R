countout <- read.csv("yearmonthId.csv")

modelnamelist <- list("1_access1-0-rcp85",
                      "2_bcc-csm1-1-rcp85",
                      "3_canesm2-rcp85",
                      "4_ccsm4-rcp85",
                      "5_cesm1-bgc-rcp85",
                      "6_cnrm-cm5-rcp85",
                      "7_csiro-mk3-6-0-rcp85",
                      "8_gfdl-cm3-rcp85",
                      "9_gfdl-esm2g-rcp85",
                      "10_gfdl-esm2m-rcp85",
                      "11_inmcm4-rcp85",
                      "12_ipsl-cm5a-lr-rcp85",
                      "13_ipsl-cm5a-mr-rcp85",
                      "14_miroc5-rcp85",
                      "15_miroc-esm-chem-rcp85",
                      "16_miroc-esm-rcp85",
                      "17_mpi-esm-lr-rcp85",
                      "18_mpi-esm-mr-rcp85",
                      "19_mri-cgcm3-rcp85",
                      "20_noresm1-m-rcp85")

for(i in 1:length(modelnamelist)){
  modelfilename <- toString( modelnamelist[i])
  dat <- read.csv(paste("H:/Delaware/RCP-8.5/",modelfilename,"/output.rch",sep=""), sep = "", skip = 9, header = F )
  rchData <- dat[c(2, 4, 5, 7, 51)]
  colnames(rchData) <- c("RCH", "MON", "AREAkm2", "FLOW_OUTcms", "WTMPdegc")
  monthdat <- subset(rchData, MON <= 12)
  
  
  shape <- readOGR("H:/Delaware/GIS_file/river.shp")
  len <- length(shape)
  
  joined <- merge(shape@data, monthdat, by.x="OBJECTID", by.y="RCH")
  shape@data <- joined
  
  system.time({
    #ids <- basin_info_dat$basin_id
    #cl <- makeCluster(8) # inital 4 cores clusters
    #registerDoSNOW(cl)  
    #totalCount <- 1
    
    #pointCount <- 1
    #totalPoints <- len #totally numners of rows in reach shapefiles
    
    #yearCount <- 1
    #totalYears <- 150
    
    #monthCount <- 1
    #currentYear <- 1950
    #currentMonth<-1
    #yearMonthCount<-1
    
    #countout <- data.frame()
    #for(yearCount in 1: totalYears){
    #  currentMonth<-1
    #  foreach(monthCount = 1:12) %do% {
    #    out <- foreach (pointCount = 1:len, .combine= "rbind")  %dopar% {
    #      data.frame(YEAR=currentYear, MONTH = currentMonth,YearMonthId = yearMonthCount)
    #      #monthdat[totalCount,"YEAR"] <- currentYear;
    #      #monthdat[totalCount,"YearMonthId"] <- yearMonthCount;
    #      #totalCount <- totalCount+1;
    #    }
    #    
    #    countout <- rbind(countout,out)
    #    yearMonthCount <- yearMonthCount +1;
    #    currentMonth <- currentMonth + 1;
    #  }
    #  currentYear <- currentYear+1;
    #}
    #write.csv(countout, file="yearmonthId.csv",row.names = FALSE)
    #countout$index = seq.int(nrow(countout))
    
    monthdat$index = seq.int(nrow(monthdat))
    result <- merge(monthdat, countout, by.x="index", by.y="index")
    #results <- parLapply(cl, 1, processrch)
    #res.df <- do.call('rbind', results)
    
    #stopCluster(cl)
  })
  #write.csv(result, file=paste("Satilla_and_Altamaha_river_","observerd_monthlyData_1_access1-0-rcp45.csv"))
  
  #monthdat <- read.csv("H:/Satilla_and_Altamaha_river_NIMA/Satilla_and_Altamaha_river_ observerd_monthlyData_1_access1-0-rcp45.csv")
  monthdat <- result[c(2,4,5,6,9)]
  colnames(monthdat)[5] <- "record_month_year_id"
  
  names(monthdat) <- tolower(names(monthdat))
  #monthdat$Id <- seq.int(nrow(monthdat))
  monthdat$is_observed <- FALSE; # add observed flag
  monthdat$model_id <- 19+i; # set model 
  monthdat$basin_id <- 8;
  #monthdat <- monthdat[c(1,2,3, 4, 5, 7,8,9)]
  write.csv(monthdat, file=paste(modelfilename,".csv",sep=""),row.names = FALSE)
  
}
