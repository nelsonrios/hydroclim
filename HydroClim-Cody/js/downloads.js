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
createYearDropdowns();
createMonthDropdowns();
function createYearDropdowns() {
    var totalYears = 50;
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

$(function () {
      $('#collapseOne').on('show.bs.collapse', function () {
          $('#hydroclim-result1').css("display","none");
      })
   });
$(function () {
      $('#collapseOne').on('hidden.bs.collapse', function () {
          $('#hydroclim-result1').empty();
           $('#hydroclim-result1').append($('<h3>your selection:</h3>'));

           if( $("input#timesub").is(':checked') ){
               var monthstart = $("#monthstart option:selected").text();
               var monthend = $("#monthend option:selected").text();
               var yearstart = $("#yearend option:selected").text();
               var yearend = $("#yearend option:selected").text();
               $('#hydroclim-result1').append($('<h6>time subset:'+ monthstart + yearstart + '-'+ monthend + yearend +'</h6>'));
             }

            if( $("input#timefull").is(':checked') ) {
                var fullmonthstart = $("#fullmonthstart option:selected").text();
                var fullmonthend = $("#fullmonthend option:selected").text();
                var fullyearstart = $("#fullyearstart option:selected").text();
                var fullyearend = $("#fullyearend option:selected").text();

                $('#hydroclim-result1').append($('<h6>time full:' + fullmonthstart + fullyearstart + '-' + fullmonthend + fullyearend + '</h6>'));
            }
           var basinselected = $("#basin-data option:selected").text();
           $('#hydroclim-result1').append($('<h6>'+ basinselected +'</h6>'));

         $('#hydroclim-result1').css("display","block");
      })
   });


$(function () {
      $('#collapseTwo').on('show.bs.collapse', function () {
          $('#hydroclim-result2').css("display","none");
      })
   });
$(function () {
      $('#collapseTwo').on('hidden.bs.collapse', function () {
          $('#hydroclim-result2').empty();
           $('#hydroclim-result2').append($('<h3>your selection:</h3>'));
           if( $("input#obs-r").is(':checked') ){
                 $('#hydroclim-result2').append($('<h6>Observed data</h6>'));
             }

             if( $("input#45-r").is(':checked') ){
                  var model45selected = $("#45-data option:selected").text();
                 $('#hydroclim-result2').append($('<h6>RCP 4.5:' + model45selected +'</h6>'));
             }
              if( $("input#85-r").is(':checked') ){
                  var model85selected = $("#85-data option:selected").text();
                 $('#hydroclim-result2').append($('<h6>RCP 8.5:'+ model85selected +'</h6>'));
             }


         $('#hydroclim-result2').css("display","block");
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