function checkDate(yearstart, yearend, monthstart, monthend, timerangetype){
	if(timerangetype == "2"){//full
		var startTime= yearstart +"/" + monthstart +"/" + "01"
		var start=new Date(startTime);
		var endTime= yearend +"/" + monthend +"/" + "01"
		var end=new Date(endTime);
		if(end<start){
			return false;
		}
	return true;
	}
	if(timerangetype == "1"){//subset
		if((parseInt(yearstart) > parseInt(yearend))||(parseInt(monthstart)>parseInt(monthend)))
			return false;
		else return true
	}
}

function showWarningMsg(element){
	$(element).show();
}

function hideWarningMsg(element){
	$(element).hide();
}