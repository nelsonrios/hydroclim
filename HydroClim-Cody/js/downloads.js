$(function () {
    $.each(modelsList45, function (i, item) {
        $('<tr>').append(
            $('<td style="padding: 1px;">').html('<input type="checkbox"/>'),
            $('<td style="padding: 1px;">').text(item.name),
            $('<td style="padding: 1px;">').text(item.description),
            $('<td style="padding: 1px;">').text(item.country)).appendTo('#45-data');
    });
});
$(function () {
    $.each(modelsList85, function (i, item) {
        $('<tr>').append(
            $('<td style="padding: 1px;">').html('<input type="checkbox"/>'),
            $('<td style="padding: 1px;">').text(item.name),
            $('<td style="padding: 1px;">').text(item.description),
            $('<td style="padding: 1px;">').text(item.country)).appendTo('#85-data');
    });
});
$(function () {
    $.each(basins, function (i, item) {
        $('<tr>').append(
            $('<td style="padding: 1px;">').html('<input type="checkbox"/>'),
            $('<td style="padding: 1px;">').text(item.name),
            $('<td style="padding: 1px;">').text(item.description)).appendTo('#basin-data');
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