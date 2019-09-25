var mapopts = {
    fullscreenControl: true
};
var map;

initMap();

function initMap() {
    ///Hydroclim variables
    var hydroclim;
    var wmts_url = "http://maps.hydroclim.org/geoserver/gwc/service/wmts?";
    var wms_cache_url = "http://maps.hydroclim.org/geoserver/gwc/service/wms?";
    var wms_url = "http://maps.hydroclim.org/geoserver/wms?";
    //var wms_local = "http://192.168.56.101:8080/geoserver/wms?";
    var wms_local = "http://maps.hydroclim.org/geoserver/wms?";
    //var wms_local = "http://localhost:8080/geoserver/hydroclim/wms?";
    var hydroclimMonthStart = 1;
    var hydroclimYearStart = 1950;
    var hydroclimMonthEnd = 1;
    var hydroclimYearEnd = 1950;
	var modeltype = 0;//observed:0
	var timerangetype = 2; //subset:1, full:2
    //var hydroclimFullLayer = "aggregateReach";
    var hydroclimFullLayer = "reach";
	
	var api_url = "http://127.0.0.1:5000"
	//var api_url = "http://hydroclimtest.centralus.cloudapp.azure.com"
	
	var hydroclimModels = modelsList45;
    
	var hydroclimSubsetLayer = "aggregateReachSubset";
    var hydroclimLayer = hydroclimFullLayer;

    //var selectedStyle = 'hydroclim:temp_flow_5_degree';
    var selectedStyle = '';
    var defaultsChanged = false;
    var layerPanelHeight = "120px";
	
	var variableValue = 'Temp'

    /////////

    ////empty base layer
    var emptyLayer = L.tileLayer('',
        { transparent: true }
    );
    emptyLayer.imageSrc = "Blank.PNG";
    ///////Create map
    map = L.map('map', {
        minZoom: 5,
       
        fullscreenControl: true
    }).setView([35.513151077520035, -96.416015625], 5);

    ///////Map Layers
    var subbasin = new L.TileLayer.WMS(wms_url,
        {
            layers: "hydroclim:subbasin",
            format: 'image/png',
            transparent: true,
            zIndex: 49,
            tiled: true
        }
    );
    subbasin.imageSrc = "Subbasin.PNG";

    var basin = new L.TileLayer.WMS(wms_url,
        {
            layers: "hydroclim:basin_basin",
            format: 'image/png',
            transparent: true,
            zIndex: 50,
            tiled: true
        }
    );
	
	var reaches = new L.TileLayer.WMS(wms_url,
        {
            layers: "hydroclim:reach_reach",
            format: 'image/png',
            transparent: true,
            zIndex: 49,
            tiled: true
        }
    );
	
	var basin = new L.GeoJSON.AJAX("http://127.0.0.1:5000/v1/basin/basin",{
					style:function(feature){
						return {color: "brown"}
					},
					onEachFeature: function (feature, layer) {
						var html_prop ="";
						for(var prop in feature.properties){
								html_prop = html_prop + '<tr><td>'+prop+'</td><td>'+feature.properties[prop]+'</td></tr>'
							}
						layer.bindPopup('<table>' + html_prop + '</table>');
						}
					});
    basin.imageSrc = "Basin.PNG";
	
	var reaches = new L.GeoJSON.AJAX("http://127.0.0.1:5000/v1/reach/reach",{
					onEachFeature: function (feature, layer) {
						var html_prop ="";
						for(var prop in feature.properties){
								html_prop = html_prop + '<tr><td>'+prop+'</td><td>'+feature.properties[prop]+'</td></tr>'
							}
						layer.bindPopup('<table>' + html_prop + '</table>');
						}
					});
    reaches.imageSrc = "Reach.PNG";

    /////Google Satellite layer
    var satMutant = L.gridLayer.googleMutant({
        
        type: 'satellite',
        zIndex: 40,
    });
    satMutant.imageSrc = "Google_Satellite.PNG";

    emptyLayer.addTo(map)

    ////Open Street Map
    var osm = new L.TileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        minZoom: 5,
        minZoom: 5,
        
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution"> CARTO</a>'
    });
    osm.imageSrc = "CARTO_dark.PNG";

    var osmLight = new L.TileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        minZoom: 5,
        
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution"> CARTO</a>'
    });
    osmLight.imageSrc = "Carto_light.PNG";

    var nhd = new L.TileLayer.WMS("https://basemap.nationalmap.gov:443/arcgis/services/USGSHydroCached/MapServer/WMSServer?", {
        layers: [0],
        dpiMode: 10,
        transparent: true,
        format: "image/png32",
        srs: "EPSG:900913"
    }).addTo(map);
    nhd.imageSrc = "NHD.PNG";

    //addAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);

	
	hydroclim = new L.GeoJSON.AJAX( api_url + "/v1/records/getallreachdata?monthstart=1&monthend=1&yearstart=1950&yearend=1950&timerangetype=1&basin_id=1&model_id=0",{
					style: function(feature) {
						d = feature.properties.temp;
							return d > 20 ? {color: 'red', opacity:0.7} :
								d > 15  ? {color: 'orange', opacity:0.7} :
								d > 10  ? {color: 'yellow', opacity:0.7} :
								d > 5  ? {color: 'green', opacity:0.7} :
											{color: 'blue', opacity:0.7};

								},
	//return getColorTemp(d)
	
					onEachFeature: function (feature, layer) {
						var html_prop ="";
						for(var prop in feature.properties){
								html_prop = html_prop + '<tr><td>'+prop+'</td><td>'+feature.properties[prop]+'</td></tr>'
							}
						html_prop += " <tr><td colspan=2> you can download the hydroclim data in "+ feature.properties.basin_name +":</td></tr>"
						var viewparams = [
											'timerangetype=' + timerangetype, 'monthstart=' + hydroclimMonthStart, 'monthend=' + hydroclimMonthEnd, 'yearstart=' + hydroclimYearStart, 'yearend=' + hydroclimYearEnd, 'basinids=' + feature.properties.basin_id , 'model_id='+modeltype, 'isobserved=on', 'isRCP45=off', 'isRCP45=on','rcp45=','rcp85=' ,'israwdata=false','isstastics=true','isavg=true','ismax=false','ismin=false','isSD=false','isVa=false'
										]
						html_prop += " <tr><td colspan=2><a href='" + api_url +"/v1/records/reachdatazip?" + viewparams.join("&") + "'>download</a></td></tr>"
						
						layer.bindPopup('<table>' + html_prop + '</table>');
						}
					}).addTo(map);
	hydroclim.on('data:loading',function(){
			$("#loading").html("<img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'/>");
			$("#loading").show();
		});
	hydroclim.on('data:loaded',function(){
			$("#loading").empty();
			$("#loading").hide();
		});
		
    hydroclim.imageSrc = "Reach.PNG";

    var baseMaps = {
        'None': emptyLayer,
        'OSM Dark': osm,
        'OSM Light': osmLight,
        'Google Satellite': satMutant
    };

    var overlays = {
        'NHD': nhd,
        'Basin': basin,
        //'Sub-basin': subbasin,
		'Reaches': reaches
        'Hydroclim': hydroclim,
    }

	/////Add Legend on Map
	function getColorTemp(d) {
		return d > 20  ? {color:'red'} :
           d > 15   ? {color:'orange'} :
           d > 10   ? {color:'yellow'} :
           d > 5   ? {color:'green'} :
                      {color:'blue'} ;
	}
	function getColorTempLegend(d) {
		return d > 20  ? 'red' :
           d > 15   ? 'orange' :
           d > 10   ? 'yellow' :
           d > 5   ? 'green' :
                      'blue';
	}
	function getColorLegend(d) {
		return d > 20   ? '#7f2704':
           d > 10   ? '#a63603':
           d > 5   ? '#d94801':
           d > 1   ? '#f16913':
           d > 0.5   ? '#fd8d3c':
           d > 0.2   ? '#fdae6b':
           d > 0.1   ? '#fdd0a2':
           d > 0   ?'#fee6ce':
				'#fff5eb';
	}
	function getColorFlow(d) {
		return d > 20   ? {color:'#7f2704'}:
           d > 10   ? {color:'#a63603'}:
           d > 5   ? {color:'#d94801'}:
           d > 1   ? {color:'#f16913'}:
           d > 0.5   ? {color:'#fd8d3c'}:
           d > 0.2   ? {color:'#fdae6b'}:
           d > 0.1   ? {color:'#fdd0a2'}:
           d > 0   ?{color:'#fee6ce'} :
				{color:'#fff5eb'};
	}

	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 15, 20],
		grades2 = [0,0.1,0.2,0.5,1,5,10,20],
        labels = [];
		div.innerHTML = "<p>temperature legend/℃</p>"
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorTempLegend(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
		div.innerHTML += "<p>discharge legend/ft³/s</p>"
		for (var i = 0; i < grades2.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorLegend(grades2[i] + 1) + '"></i> ' +
            grades2[i] + (grades2[i + 1] ? '&ndash;' + grades2[i + 1] + '<br>' : '+');
		}
		return div;
	};
	legend.addTo(map);
	
	
	function updateLegend(variableValue){
		map.removeControl(legend);
		legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
        grades = (variableValue == 'Temp')?[0, 5, 10, 15, 20]:[0,0.1,0.2,0.5,1,5,10,20],
        labels = [];
		div.innerHTML = (variableValue == 'Temp')?"<p>temperature legend/℃</p>":"<p>discharge legend/ft³/s</p>"
    // loop through our density intervals and generate a label with a colored square for each interval
	if(variableValue == 'Temp'){
		for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorTempLegend(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
		return div;
		}
	else{
		for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorLegend(grades[i] +1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
		return div;
	}
	legend.addTo(map);
	}
	}
    /////Add layer controls to control panel
    var controlPanel = L.control.layerManager(baseMaps, overlays,
        {
            collapsed: false
        }
    ).addTo(map);

    //Add seperator to control panel
    $(".leaflet-control-layers-list").append('<div class="leaflet-control-layers-separator"></div>');
    $(".leaflet-control-layers-list").append('<div class="leaflet-control-data-options"></div>');

    //$(".leaflet-control-layers").append('<div class="control-panel-toggle-option layers-toggle"><a class="leaflet-control-layers-click-toggle control-layer-toggle-open" href="#" title="Open Available Layers"></a></div>');
    $(".leaflet-control-layers").append('<div class="control-panel-toggle-option hydroclim-data-toggle"><a class="leaflet-control-hydroclim-data-click-toggle logo control-layer-toggle-open"  data-toggle="collapse" data-target="#map-side-panel" href="#" title="Open Hydroclim Data Options"></a></div>');

    //Add seperator to control panel 
    $("#leaflet-control-panel").append('<div class="leaflet-control-layers-separator"></div>');
    $("#leaflet-control-panel").append('<div class="leaflet-control-data-options"></div>');


    $(".leaflet-control-data-options").append('<div class="btn-group btn-group-justified" data-toggle="buttons" id="time-scope-selection"></div>');

    //Add scale to map
    L.control.scale({
        metric: true,
        imperial: true
    }).addTo(map);


    ////Add mouse position to map 
    L.control.mousePosition().addTo(map);
	
	
	////Test Geojson from API
	map.on('click', function(e) {
		console.time('API')
		//alert('lat：' + e.latlng.lat + '\n long：' + e.latlng.lng);
		//getReachShape(e.latlng.lat, e.latlng.lng)
	});
	function getReachShape(lat,lng){
		 $.ajax({
        //url: "http://127.0.0.1:5000/v1/basin/basin", 
        //url: "http://127.0.0.1:5000/v1/reach/reach",
		url: "http://127.0.0.1:5000/v1/reach/reach?X=" + lat + "&Y="+ lng,
		//url: "http://127.0.0.1:5000/v1/records/getreachdata",
		type: "GET",             
        data: {},
        dataType: 'json',
        cache: false,
		beforeSend:function(XMLHttpRequest){
			$("#loading").html("<img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'/>");
		},
        success: function(data)
			{
				if (JSON.stringify(data) == '{}'){
					alert('There are no Reaches here');
				}
				else{
				var geojsonLayer = new L.GeoJSON(data,{
					onEachFeature: function (feature, layer) {
						var html_prop ="";
						for(var prop in feature.properties){
								html_prop = html_prop + '<tr><td>'+prop+'</td><td>'+feature.properties[prop]+'</td></tr>'
							}
						layer.bindPopup('<table>' + html_prop + '</table>');
						}
					});
				geojsonLayer.addTo(map);
				}
				$("#loading").empty();
				console.timeEnd('API')
			},
			error: function (request, status, error) {
				$("#loading").empty();
				console.log(error);
			}
		});
	}
	


    //////////////////////////
    /////On change functions for Month, Year, Style selectors
    //////////////////////////
		var monthstart = hydroclimMonthStart
		var monthend =  hydroclimMonthEnd
		var yearstart = hydroclimYearStart
		var yearend = hydroclimYearEnd
		var timerange = timerangetype;
		if(!checkDate(yearstart, yearend, monthstart, monthend, timerangetype))
		{
			alert("Start date should be before end date")
			return false;
		}
		else return true;
	}
    $("#monthstart").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimMonthStart = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        //updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#yearstart").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimYearStart = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#monthend").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimMonthEnd = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#yearend").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimYearEnd = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#fullmonthstart").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimMonthStart = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#fullyearstart").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimYearStart = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#fullmonthend").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimMonthEnd = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#fullyearend").change(function () {
        //map.removeLayer(hydroclim);
        hydroclimYearEnd = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#style").change(function () {
        //map.removeLayer(hydroclim);
        selectedStyle = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        //updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
	$("#model").change(function () {
        //map.removeLayer(hydroclim);
        modeltype = this.value;
        defaultsChanged = true;
        //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
    });
    $("#hydroclim-data").change(function () {
        //map.removeLayer(hydroclim);
        if (this.checked) {
            //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
           // updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
        } 
        defaultsChanged = true;

    });
	
	
	
	$("#flow").change(function () {
        //map.removeLayer(hydroclim);
        //if (this.checked) {
            //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
          //  updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
        //} 
        //defaultsChanged = true;
		if($('#flow').is(':checked')){
			variableValue = 'Flow'
			hydroclim.eachLayer(function (layer) {
			layer.setStyle(getColorFlow(layer.feature.properties.discharge))})
		}
			//hydroclim.setStyle({color :'blue'}) 
    });
	
	
	$("#temp").change(function () {
        //map.removeLayer(hydroclim);
        //if (this.checked) {
            //updateHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
          //  updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
        //} 
        //defaultsChanged = true;
		if($('#temp').is(':checked')){
			variableValue = 'Temp'
			hydroclim.eachLayer(function (layer) {
			layer.setStyle(getColorTemp(layer.feature.properties.temp))})
		}
		
			//hydroclim.setStyle({color :'blue'}) 
    });
	

    $(".leaflet-control-layers-click-toggle").click(function () {
        var display = $(".hydroclim-layers");
        var toggle = $(".leaflet-control-layers-click-toggle")
        if (display.is(":visible")) {
            display.hide();
            toggle.removeClass("control-layer-toggle-open");
        } else {
            display.show();
            toggle.addClass("control-layer-toggle-open");
        }
        checkIfPanelShouldBeOpen();
    });
    $(".leaflet-control-hydroclim-data-click-toggle").click(function () {
        var display = $(".map-parent");
        var toggle = $(".leaflet-control-hydroclim-data-click-toggle");
        var img = $(".hydroclim-data-img");
        if (display.is(":visible")) {
            //display.hide();
            toggle.removeClass("control-layer-toggle-open");
        } else {
            //display.show();
            toggle.addClass("control-layer-toggle-open");
        }
        checkIfPanelShouldBeOpen();
        //if (display.hasClass("layer-display-open")) {
        //    display.removeClass("layer-display-open");
        //    toggle.removeClass("control-layer-toggle-open");
        //} else {
        //    display.addClass("layer-display-open");
        //    toggle.addClass("control-layer-toggle-open");
        //}
    });
    function checkIfPanelShouldBeOpen() {
        var layers = $(".leaflet-control-layers-click-toggle");
        var data = $(".leaflet-control-hydroclim-data-click-toggle");
        var displayPanel = $(".map-parent");
        if (layers.hasClass("control-layer-toggle-open") || data.hasClass("control-layer-toggle-open")) {
            displayPanel.show();
            $('.map-child').width($(".map-container").width() - $(".map-parent").width() - 23);
        } else {
            displayPanel.hide();
            $(".map-child").width("99%");
        }
    }
    $(".control-layer-toggle").click(function () {
        var display = $("#layer-display-container");
        var toggle = $(".leaflet-control-layers-click-toggle")
        if (display.hasClass("layer-display-open")) {
            display.removeClass("layer-display-open");
            toggle.removeClass("control-layer-toggle-open");
            toggleOpen.show();
            toggleClosed.hide();
        } else {
            display.addClass("layer-display-open");
            toggle.addClass("control-layer-toggle-open");
            toggleOpen.hide();
            toggleClosed.show();
        }
    });
    /////////////
    ////Data Options
    /////////////
    $('<div id="toggle-data-options" class="control-panel-toggle"><span id="toggle-data-options-on" title="Toggle data options" class="glyphicon glyphicon-chevron-right"></span><span id="toggle-data-options-off" title="Toggle data options" class="glyphicon glyphicon-chevron-down"></span></span><span class="title-toggle">&nbsp;Data Options</div>').insertBefore('.leaflet-control-data-options');
    $('.leaflet-control-data-options').hide();
    $("#toggle-data-options-off").hide();


    var baseMaps = $(".leaflet-control-layers-base");
    baseMaps.detach();
    $("#hydroclim-layers-base-maps").append(baseMaps);

    var overlays = $(".leaflet-control-layers-overlays");
    overlays.detach();
    $("#hydroclim-layers-overlays").append(overlays);

    $(".leaflet-control-layers-list").detach();

    $('.map-child').width($(".map-container").width() - $(".map-parent").width() - 23);
    $('.map-parent').resize(function () {
        var menuOptionMaxSize = $(".map-container").width() * 0.8;
        $(this).resizable("option", "minWidth", 300);
        $(this).resizable("option", "maxWidth", menuOptionMaxSize);
        $('.map-child').width($(".map-container").width() - $(".map-parent").width() - 23);
    });

    $(window).resize(function () {
        $('.map-child').width($(".map-container").width() - $(".map-parent").width() - 23);
    });

    function addAggregateHydroclimLayer(monStart, monEnd, yearStart, yearEnd, style,modeltype) {
        var viewparams = [
            'monthstart:' + monStart, 'monthend:' + monEnd, 'yearstart:' + yearStart, 'yearend:' + yearEnd
        ]

        var full_url = ""
        full_url = encodeURI(wms_local);
        hydroclim = new L.TileLayer.WMS(full_url,
            {
                layers: "hydroclim:" + hydroclimLayer,
                format: 'image/png',
                styles: style,
                transparent: true,
                zIndex: 51,
                tiled: true
            }
        ).addTo(map);
    }

    function updateAggregateHydroclimLayer(monStart, monEnd, yearStart, yearEnd,style,modeltype) {
		if(dateValidation()) return false;
		else{
			var viewparams = [
            'timerangetype=' + timerangetype, 'monthstart=' + monStart, 'monthend=' + monEnd, 'yearstart=' + yearStart, 'yearend=' + yearEnd, 'basin_id=1' , 'model_id='+modeltype
        ]

        //hydroclim.wmsParams.styles = style;
        //hydroclim.wmsParams.layers = "hydroclim:" + hydroclimLayer;

        /*var full_url = ""
        if (defaultsChanged) {
            full_url = encodeURI(wms_local + "viewparams=" + viewparams.join(';'));
        } else {
            full_url = encodeURI(wms_local);
        }

        hydroclim._url = full_url;

        hydroclim.redraw();*/
		 //if (defaultsChanged) {
            full_url = encodeURI(api_url + "/v1/records/getallreachdata?" + viewparams.join('&'));
        //} else {
           // full_url = encodeURI("http://127.0.0.1:5000/v1/records/getallreachdata");
        //}
		//map.removeLayer(hydroclim);
		map.removeLayer(hydroclim);
		hydroclim = new L.GeoJSON.AJAX(full_url,{
					style: function(feature) {
						if(variableValue == 'Temp'){
							d = feature.properties.temp;
							return d > 20 ? {color: 'red', opacity:0.7} :
								d > 15  ? {color: 'orange', opacity:0.7} :
								d > 10  ? {color: 'yellow', opacity:0.7} :
								d > 5  ? {color: 'green', opacity:0.7} :
											{color: 'blue', opacity:0.7};

							}
						else{
							d = feature.properties.discharge;
							return d > 20   ? {color:'#7f2704'}:
								d > 10   ? {color:'#a63603'}:
								d > 5   ? {color:'#d94801'}:
								d > 1   ? {color:'#f16913'}:
								d > 0.5   ? {color:'#fd8d3c'}:
								d > 0.2   ? {color:'#fdae6b'}:
								d > 0.1   ? {color:'#fdd0a2'}:
								d > 0   ?{color:'#fee6ce'} :
									{color:'#fff5eb'};
							}
						},
					onEachFeature: function (feature, layer) {
						var html_prop ="";
						for(var prop in feature.properties){
								html_prop = html_prop + '<tr><td>'+prop+'</td><td>'+feature.properties[prop]+'</td></tr>'
							}
						layer.bindPopup('<table>' + html_prop + '</table>');
						}
					}).addTo(map);
		hydroclim.on('data:loading',function(){
			$("#loading").html("<img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'/>");
			$("#loading").show();
		});
		hydroclim.on('data:loaded',function(){
			$("#loading").empty();
			$("#loading").hide();
		});
		}
        
		
    }

    // @function splitWords(str: String): String[]
    // Trims and splits the string on whitespace and returns the array of parts.
    function splitWords(str) {
        return trim(str).split(/\s+/);
    }
	

	
    ///////////////////////////////////////////////////
    /////////Add data to Month, Year, Style selectors
    ///////////////////////////////////////////////////
    createYearDropdowns();
    createMonthDropdowns();
    createStylesDropdowns();
    createSeasonsDropdowns();
    //createModelDropdowns();

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
    function createStylesDropdowns() {
        var index, len;
        for (index = 0, len = hydroclimStyles.length; index < len; ++index) {
            var style = hydroclimStyles[index];
            var newOption = $('<option value="' + style.value + '">' + style.name + '</option>');
            $('#style').append(newOption);
        }
    }
    function createSeasonsDropdowns() {
        var index, len;
        for (index = 0, len = seasons.length; index < len; ++index) {
            var style = seasons[index];
            var newOption = $('<option value="' + style.value + '">' + style.name + '</option>');
            $('#seasons').append(newOption);
        }
    }
    /*function createModelDropdowns() {
        var index, len;
        for (index = 0, len = hydroclimModels.length; index < len; ++index) {
            var style = hydroclimModels[index];
            var newOption = $('<option value="' + style.id + '">' + style.name + '</option>');
            $('#model').append(newOption);
        }
    }*/
	function updateModelDropdowns() {
		$('#model').empty();
        var index, len;
        for (index = 0, len = hydroclimModels.length; index < len; ++index) {
            var style = hydroclimModels[index];
            var newOption = $('<option value="' + style.id + '">' + style.name + '</option>');
            $('#model').append(newOption);
        }
    }
	
    //Hide Layer list to begin
    $(document).ready(function () {
        var fullPicker = $("#hydroclim-date-panel-from-to");
        var subsetPicker = $("#hydroclim-date-panel-subset");

        fullPicker.css('display', 'block');
        subsetPicker.css('display', 'none');

        $(".leaflet-control-layers-list").hide();
		
		
	//Add models selectors of RCP4.5 & RCP 8.5(from data.js)
        $("input[name=data-selector]").on("change", function () {
            var modelSelector = $("#data-selection-model");
            var val = $(this).val();
            if (val == 'Observed') {
                modelSelector.css('display', 'none'); 
				hydroclimModels = [];
				modeltype = 0;
				//updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle,modeltype);
                    
            } else {
                modelSelector.css('display', 'block');
				if (val == 'rcp45')
				{
					hydroclimModels = modelsList45;
					modeltype = 1;
					//modeltype = $("#model").value();
					//updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, modeltype);
                
					
				}
				else
				{
					hydroclimModels = modelsList85; 
					modeltype = 20;
					//modeltype = $("#model").value();
					//updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, modeltype);
                
				}
            }
			updateModelDropdowns();
        });

        $("input[name=time-selector]").on("change", function () {
            
            var val = $(this).val();
            switch (val) {
                case 'full':
                    fullPicker.css('display', 'block');
                    subsetPicker.css('display', 'none');
                    hydroclimLayer = hydroclimFullLayer;
					timerangetype = "2"; //Full
                    //updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle);
                    break;
                case 'subset':
                    fullPicker.css('display', 'none');
                    subsetPicker.css('display', 'block');
                    hydroclimLayer = hydroclimSubsetLayer;
					timerangetype = "1"; //Subset
                    //updateAggregateHydroclimLayer(hydroclimMonthStart, hydroclimMonthEnd, hydroclimYearStart, hydroclimYearEnd, selectedStyle);
                    break;
                default:
                    break;
            }
        });
    })
}


	////// Test GeoServer 
	////// Test GeoServer 
/*map.on('click', function(e) {
		console.time('GeoServer')
		//alert('lat：' + e.latlng.lat + '\n long：' + e.latlng.lng);
		var basin_id;
		loadWFS("cite:basin","EPSG:4326",'CONTAINS(geom, POINT (' + e.latlng.lng +' ' + e.latlng.lat +'))', function loadWfsHandler(data) {
                console.log(data);
				if(data.features.length > 0)
				{
					basin_id = data.features[0].properties.basin_info_id;
					loadWFS("cite:reach","EPSG:4326",'basin_id = ' + basin_id, function loadWfsReach(data){
						layer = L.geoJson(data,{
					onEachFeature: function (feature, layer) {
						var html_prop ="";
						for(var prop in feature.properties){
								html_prop = html_prop + '<tr><td>'+prop+'</td><td>'+feature.properties[prop]+'</td></tr>'
							}
						layer.bindPopup('<table>' + html_prop + '</table>');
						}
					})
						layer.addTo(map)
						console.timeEnd('GeoServer')
					})
					
				}
				else
					alert('There are no Reaches here');

            })
		
	});
	var layer;
	//loadWFS("cite:reach", "EPSG:4326")
	function loadWFS(layerName, epsg, CQL_string,func) {
            var urlString = "http://localhost:8080/geoserver/cite/ows";
            var param = {
                service: 'WFS',
                version: '1.0.0',
                request: 'GetFeature',
                typeName: layerName,
				//outputFormat:'json',
				//format_options:'callback:loadWfsHandler',
                outputFormat: 'application/json',
                maxFeatures:3200,
                srsName: epsg,
				CQL_FILTER:CQL_string
            };
            var u = urlString + L.Util.getParamString(param, urlString);
            
            console.log(u);          
            $.ajax({
				//jsonp: false,
				//jsonpCallback: 'getJson',
                url:u,
				type:'GET',
                dataType: 'json',
                success: func, 

               });
           
        }*/
		
		
	
		
	
 
    //////////Allow drawable polygons on map
    //// Initialise the FeatureGroup to store editable layers
    //var editableLayers = new L.FeatureGroup();
    //map.addLayer(editableLayers);

    //var drawPluginOptions = {
    //    position: 'topright',
    //    draw: {
    //        polygon: {
    //            allowIntersection: false, // Restricts shapes to simple polygons
    //            drawError: {
    //                color: '#e1e100', // Color the shape will turn when intersects
    //                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
    //            },
    //            shapeOptions: {
    //                color: '#97009c'
    //            }
    //        },
    //        // disable toolbar item by setting it to false
    //        polyline: false,
    //        circle: false, // Turns off this drawing tool
    //        rectangle: false,
    //        marker: false,
    //    },
    //    edit: {
    //        featureGroup: editableLayers, //REQUIRED!!
    //        remove: false
    //    }
    //};
    //// Initialise the draw control and pass it the FeatureGroup of editable layers
    //var drawControl = new L.Control.Draw(drawPluginOptions);
    //map.addControl(drawControl);

    //var editableLayers = new L.FeatureGroup();
    //map.addLayer(editableLayers);

    //map.on('draw:created', function (e) {
    //    var type = e.layerType,
    //        layer = e.layer;

    //    if (type === 'marker') {
    //        layer.bindPopup('A popup!');
    //    }

    //    editableLayers.addLayer(layer);
    //});
    //////////

    ///////////////////////////
    /////Add Month, Year, Style selectors to control panel
    ///////////////////////////
    //var monthDropdown = '<div style="margin-bottom:5px;"><select id="months" name="months"></select></div>';
    //$(".leaflet-control-data-options").append(monthDropdown);

    //var yearDropdown = '<div style="margin-bottom:5px;"><select id="years" name="years"></select></div>';
    //$(".leaflet-control-data-options").append(yearDropdown);

    //var styleDropdown = '<div style="margin-bottom:5px;"><select id="style" name="style"></select></div>';
    //$(".leaflet-control-data-options").append(styleDropdown);
