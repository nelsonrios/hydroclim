//import {Spinner} from 'spin.js';

//var api_url = "http://hydroclimtest.centralus.cloudapp.azure.com"
var api_url = "http://129.81.224.186"

/**
*	Form template and element actions
*/
$(function () {
    $.each(modelsList45, function (i, item) {
        $('#45-data').append(
             $('<option value="' + item.id + '">' + item.name + '</option>'));
    });
});
$(function () {
    $.each(modelsList85, function (i, item) {
        $('#85-data').append(
             $('<option value="' + item.id + '">' + item.name + '</option>'));
    });
});
$(function () {
    $.each(basins, function (i, item) {
        $('#basin-data').append(
            $('<option value="' + item.id + '">' + item.name + '</option>'));
    });
});
$("input#hydroclim-stast").change(function(){
	if( $("input#hydroclim-stast").is(':checked') ) {
		$("input[name=hydroclim-stas]").prop("disabled", false);
	}
	else
		$("input[name=hydroclim-stas]").prop("disabled", true);
});


$(function () {
      $('#collapseOne').on('show.bs.collapse', function () {
          $('#hydroclim-result1').hide();
      })
   });
$(function () {
      $('#collapseOne').on('hidden.bs.collapse', function () {
          $('#date-result').empty();
		  $('#basin-result').empty();
           $('#date-result').append($('<h3>your selection:</h3>'));

           if( $("input#timesub").is(':checked') ){
               var monthstart = $("#monthstart option:selected").text();
               var monthend = $("#monthend option:selected").text();
               var yearstart = $("#yearstart option:selected").text();
               var yearend = $("#yearend option:selected").text();
               $('#date-result').append($('<h6>time subset:'+ monthstart + yearstart + '-'+ monthend + yearend +'</h6>'));
			    dateValidation()
             }

            if( $("input#timefull").is(':checked') ) {
                var monthstart = $("#monthstart option:selected").text();
               var monthend = $("#monthend option:selected").text();
               var yearstart = $("#yearstart option:selected").text();
               var yearend = $("#yearend option:selected").text();
				dateValidation()
                $('#basin-result').append($('<h6>time full:' +  monthstart + yearstart + '-'+ monthend + yearend + '</h6>'));
            }
           var basinselected = $("#basin-data option:selected").text();
		    basinValidation()
           $('#basin-result').append($('<h6>'+ basinselected +'</h6>'));
		  

         $('#hydroclim-result1').show();
      })
   });


$(function () {
      $('#collapseTwo').on('show.bs.collapse', function () {
          $('#hydroclim-result2').css("display","none");
      })
   });
$(function () {
      $('#collapseTwo').on('hidden.bs.collapse', function () {
          $('#model-result').empty();
		   $('#rcp-result').empty();
           $('#model-result').append($('<h3>your selection:</h3>'));
           if( $("input#obs-r").is(':checked') ){
                 $('#model-result').append($('<h6>Observed data</h6>'));
             }

             if( $("input#45-r").is(':checked') ){
                  var model45selected = $("#45-data option:selected").text();
                 $('#rcp-result').append($('<h6>RCP 4.5:' + model45selected +'</h6>'));
             }
              if( $("input#85-r").is(':checked') ){
                  var model85selected = $("#85-data option:selected").text();
                 $('#rcp-result').append($('<h6>RCP 8.5:'+ model85selected +'</h6>'));
             }
			modelValidation();
			rcpValidation();

         $('#hydroclim-result2').show();
      })
   });

$(function () {
      $('#collapseThree').on('show.bs.collapse', function () {
          $('#hydroclim-result3').css("display","none");
      })
   });
$(function () {
      $('#collapseThree').on('hidden.bs.collapse', function () {
          $('#hydroclim-result3').empty();
           $('#hydroclim-result3').append($('<h3>your selection:</h3>'));
           if( $("input#hydroclim-stast-orig").is(':checked') ){
                 $('#hydroclim-result3').append($('<h6>Raw data</h6>'));
             }

             if( $("input#hydroclim-stast").is(':checked') ) {
                 $('#hydroclim-result3').append('Statistics:');
                 var selectedStats = $("input[name=hydroclim-stas]:checked");
                 for(var checkeditem =0; checkeditem < selectedStats.length; checkeditem++){
                     var text = $(selectedStats[checkeditem]).val();
                      $('#hydroclim-result3').append(text + ' ');
                 }

             }


         $('#hydroclim-result3').css("display","block");
      })
   });



$('input#45-r').on('click',function () {
     if( $(this).is(':checked') )
     { $('#45-data').prop('disabled', false);
        $('#45-data').selectpicker('refresh');}
     else
     {
         $('#45-data').prop('disabled', true);
        $('#45-data').selectpicker('refresh');
     }

});
$('input#85-r').on('click',function () {
     if( $(this).is(':checked') )
     { $('#85-data').prop('disabled', false);
        $('#85-data').selectpicker('refresh');}
     else
     {
         $('#85-data').prop('disabled', true);
        $('#85-data').selectpicker('refresh');
     }

});

$('#basin-data').change(function () {
        var selectedItem = $('#basin-data').val();
    });

createYearDropdowns();
createMonthDropdowns();
function createYearDropdowns() {
    var totalYears = 150;
    var startYear = 1950;
    var count = 1;

    while (count <= totalYears) {
        var newOption = $('<option value="' + startYear + '">' + startYear + '</option>');
        $('#yearstart').append(newOption.clone());
        $('#yearend').append(newOption.clone());
        $('#fullyearstart').append(newOption.clone());
        $('#fullyearend').append(newOption.clone());
        count++;
        startYear++;
    }
}

function createMonthDropdowns() {
    var index, len;
    for (index = 0, len = months.length; index < len; ++index) {
        var month = months[index];
        var newOption = $('<option value="' + month.value + '">' + month.name + '</option>');
        $('#monthstart').append(newOption.clone());
        $('#monthend').append(newOption.clone());
        $('#fullmonthstart').append(newOption.clone());
        $('#fullmonthend').append(newOption.clone());
    }
}

function showSpinner() {
    var opts = {
      lines: 15, // The number of lines to draw
      length: 3, // The length of each line
      width: 4, // The line thickness
      radius: 30, // The radius of the inner circle
      rotate: 0, // The rotation offset
      color: '#fff', // #rgb or #rrggbb
      speed: 2, // Rounds per second
      trail: 70, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    $('#loading_anim').each(function() {
        //spinner = new Spinner(opts).spin(this);
		
    });
}


/**
*	Download Data
*/
$("#submitform").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
	
	//$('<div class=loadingDiv>loading...</div>').prependTo(document.body);
	
	// setTimeout(function() {
      //      setTimeout(function() {showSpinner();},3000000000000000000);
      showSpinner()   
	 dateValidation();
	 basinValidation();
	 modelValidation();
    if(validateValue == false)	{
		alert("please check your form!")
		return validateValue;
	}
	else{	 
    var form = $(this);
	var string = form.serialize()
	//validate flag


	//A.Date
	var timerangetype = "&timerangetype=1";//default subset
	if ($("input#timesub").is(':checked'))	
		timerangetype = "&timerangetype=1" 
	else if($("input#timefull").is(':checked'))
		timerangetype = "&timerangetype=2" 

	var basin_id = "&basinids=" + String($('#basin-data').val());
	basin_id = basin_id.split(",").join("_");
	
	//B.Model
	var obs_r = ''
	if ($("input#obs-r").is(':checked'))
		obs_r = "&isobserved=on"
	else 
		obs_r = "&isobserved=off"
	var isrcp45 = ''
	var rcp45 = ''
	if ($("input#45-r").is(':checked'))
		{
			isrcp45 = "&isRCP45=on"
			rcp45 = "&rcp45=" + $('#45-data').val().join("_")
		}
	else 
	{
		isrcp45 = "&isRCP45=off"
		rcp45 = "&rcp45="
	}
	var isrcp85 = ''
	if ($("input#85-r").is(':checked'))
		{
			isrcp85 = "&isRCP85=on"
			rcp85 = "&rcp85=" + $('#85-data').val().join("_")
		}
	else 
	{
		isrcp85 = "&isRCP85=off"
		rcp85 = "&rcp85="
		
	}
	//C.Stastics
	var stast_orig = ''
	if ($("input#hydroclim-stast-orig").is(':checked'))
		stast_orig = "&israwdata=true"
	else 
		stast_orig = "&israwdata=false"
	
	var stast = ''
	if ($("input#hydroclim-stast").is(':checked'))
		{
			stast = "&isstastics=true"
			if ($("input#avg").is(':checked'))
				stast += "&isavg=true"
			else 
				stast += "&isavg=false"
			if ($("input#max").is(':checked'))
				stast += "&ismax=true"
			else 
				stast += "&ismax=false"
			if ($("input#min").is(':checked'))
				stast += "&ismin=true"
			else 
				stast += "&ismin=false"
			if ($("input#sd").is(':checked'))
				stast += "&isSD=true"
			else 
				stast += "&isSD=false"
			if ($("input#va").is(':checked'))
				stast += "&isVa=true"
			else 
				stast += "&isVa=false"
		}
	else 
		{
			stast= "&isstastics=false&isavg=false&ismax=false&ismin=false&isSD=false&isVa=false"
		}
	const url = api_url + '/v1/records/reachdatazip?' + string + basin_id + timerangetype + obs_r + isrcp45 + isrcp85 + rcp45 + rcp85 +stast_orig + stast ,
	fileName = "my-csv.csv";
    /*$.ajax({
           type: "GET",
           url: 'http://hydroclimtest.centralus.cloudapp.azure.com/v1/basin/basin',
           //data: string + basin_id, // serializes the form's elements.
		   ajaxSend: function(){ $("#loading").show();},
		   beforeSend:function(){ $("#loading").show();},
           success: function(result)
           {
                const saveData = (function () {
				const a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				return function (url, fileName) {
					a.href = url;
					a.download = fileName;
					a.click(function() {
						
						});
					};
				}());
				saveData(url, fileName);
				 $("#loading").hide();
           },
		   complete:function(e){
			   //$("#loading").hide();
		   },
		   ajaxComplete:function(){
			   $("#loading").hide();
		   }
         });
		 */
		const saveData = (function () {
		const a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		return function (url, fileName) {
			a.href = url;
			a.download = fileName;
			a.click(function() {
				$("#loading").hide();
				});
			};
		}());

	

saveData(url, fileName);
alert("Download will start in a few minutes!")


}



});


/**
*	Validation
*/
/**
*	improvement required: validation funcs onvergence 
*/
var validateValue =true
$("select.selectpicker.date-selection").change(function(){
	dateValidation();
})
$("input#45-r").change(function(){
	rcpValidation()
})
$("input#85-r").change(function(){
	rcpValidation()
})
$("input#obs-r").change(function(){
	modelValidation()
})
$("#basin-data").change(function(){
	basinValidation();
})

//validate Date
function dateValidation(){
	 var monthstart = $("#monthstart option:selected").val();
     var monthend = $("#monthend option:selected").val();
     var yearstart = $("#yearstart option:selected").text();
     var yearend = $("#yearend option:selected").text();
	 var timerange = 1;
	 if($("input#timefull").is(':checked') ) timerange =2
	 if(!checkDate(yearstart,yearend,monthstart,monthend, timerange))
	 {
		  validateValue = false;
		 showWarningMsg("#warning-date");
		 showWarningMsg("#warning-date-r");
		 }
	 else
	 {
		  validateValue = true;
		 hideWarningMsg("#warning-date");
		 hideWarningMsg("#warning-date-r");
		 }
}
//basin option validation
function basinValidation(){
	var basinselected = $("#basin-data option:selected").text();
	if (basinselected == "" )  {
		 validateValue = false;
		 showWarningMsg("#warning-basin");
		 showWarningMsg("#warning-basin-r");
		 }
	 else
	 {
		  validateValue = true;
		 hideWarningMsg("#warning-basin");
		 hideWarningMsg("#warning-basin-r");
		 }
}

//model option validation
function modelValidation(){
	if ( (!$("input#obs-r").is(':checked')) && (!$("input#45-r").is(':checked')) && (!$("input#85-r").is(':checked')))  {
		 validateValue = false;
		 showWarningMsg("#warning-model");
		 showWarningMsg("#warning-model-r");
		 }
	 else
	 {
		  validateValue = true;
		 hideWarningMsg("#warning-model");
		 hideWarningMsg("#warning-model-r");
		 hideWarningMsg("#warning-rcp");
			hideWarningMsg("#warning-rcp-r");
		 }
}

//observed model option validation
function observedmodelValidation(){
	if ( (!$("input#obs-r").is(':checked')))  {
		 validateValue = false;
		 showWarningMsg("#warning-model");
		 showWarningMsg("#warning-model-r");
		 }
	 else
	 {
		  validateValue = true;
		 hideWarningMsg("#warning-model");
		 hideWarningMsg("#warning-model-r");
		 }
}
//
function rcpValidation(){
	 if( $("input#45-r").is(':checked') ){
		 var model45selected = $("#45-data option:selected").text();
         if(model45selected == ""){
			  validateValue = false;
			showWarningMsg("#warning-rcp");
			showWarningMsg("#warning-rcp-r");
			}
		else
		{
			 validateValue = true;
			hideWarningMsg("#warning-rcp");
			hideWarningMsg("#warning-rcp-r");
		 }
       }
	  
	 if( $("input#85-r").is(':checked') ){
		 var model85selected = $("#85-data option:selected").text();
         if(model85selected == ""){
			  validateValue = false;
			showWarningMsg("#warning-rcp");
			showWarningMsg("#warning-rcp-r");
			}
		else
		{
			 validateValue = true;
			hideWarningMsg("#warning-rcp");
			hideWarningMsg("#warning-rcp-r");
		 }
       }
	   if ( ($("input#obs-r").is(':checked')))  {
		    validateValue = true;
		 hideWarningMsg("#warning-rcp");
		 hideWarningMsg("#warning-rcp-r");
		 }
	   	modelValidation();
}

//stats option validation
function statsValidation(){
	if (  (!$("input#hydroclim-stast-orig").is(':checked')) && (!$("input#hydroclim-stast").is(':checked')))  {
		 showWarningMsg("#warning-stats");
		 showWarningMsg("#warning-stats-r");
		 validateValue = false;
		 }
	 else
	 {
		  validateValue = true;
		 hideWarningMsg("#warning-stats");
		 hideWarningMsg("#warning-stats-r");
		 }
}


