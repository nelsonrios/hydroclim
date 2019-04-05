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
    var wms_local = "http://192.168.56.101:8080/geoserver/wms?";
    var hydroclimMonth = 1;
    var hydroclimYear = 1950;
    var hydroclimStyles = [{ name: "Temp and Flow", value: "hydroclim:temp_and_flow" }, { name: "Temperature", value: "hydroclim:temperature" }, { name: "Flow", value: "hydroclim:flow" }];
    var months = [{ name: "January", value: 1 }, { name: "February", value: 2 }, { name: "March", value: 3 }, { name: "April", value: 4 }, { name: "May", value: 5 }, { name: "June", value: 6 }, { name: "July", value: 7 }, { name: "August", value: 8 }, { name: "September", value: 9 }, { name: "October", value: 10 }, { name: "November", value: 11 }, { name: "December", value: 12 }];
    var selectedStyle = 'hydroclim:temp_and_flow';
    var defaultsChanged = false;

    /////////

    ////empty base layer
    var emptyLayer = L.tileLayer('',
        { transparent: true }
    );
    ///////Create map
    map = L.map('map', {
        minZoom: 5,
        maxZoom: 15,
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
    var basin = new L.TileLayer.WMS(wms_url,
        {
            layers: "hydroclim:basin",
            format: 'image/png',
            transparent: true,
            zIndex: 50,
            tiled: true
        }
    ).addTo(map);

    /////Google Satellite layer
    var satMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'satellite',
        zIndex: 40,
    });
    ////Open Street Map
   
    var osm = new L.TileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {minZoom: 5,
        maxZoom: 15, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution"> CARTO</a>'
    });
    
    var osmLight = new L.TileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        minZoom: 5,
        maxZoom: 15, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution"> CARTO</a>'
    });

    var nhd = new L.TileLayer.WMS("https://basemap.nationalmap.gov/arcgis/services/USGSHydroCached/MapServer/WMSServer?", {
        layers: [0],
        transparent: true
    }).addTo(map);

    addHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);

    var baseMaps = {
        'None': emptyLayer,
        'NHD': nhd,
        'OSM Dark': osm,
        'OSM Light': osmLight,
        'Google Satellite': satMutant
    };

    var overlays = {
        'Basin': basin,
        'Sub-basin': subbasin
    }
   
    ///Add layer controls to control panel
    L.control.layers(baseMaps, overlays,
        {
            collapsed: false
        }
    ).addTo(map);

    //Add seperator to control panel 
    $(".leaflet-control-layers-list").append('<div class="leaflet-control-layers-separator"></div>');

    //Add reach data switch
    $(".leaflet-control-layers-overlays").append('<label><div><input type="checkbox" id="hydroclim-data" class="leaflet-control-layers-selector" checked><span> Hydroclim</span></div></label>');

    $(".leaflet-control-layers-list").prepend('<div class="leaflet-control-layers-separator"></div>');

    $(".leaflet-control-layers-list").prepend('<span id="hide-control-panel" title="Hide control panel" class="glyphicon glyphicon-remove"></span>');
    console.log($(".leaflet-control-layers"));
    $(".leaflet-control-layers").append('<a class="leaflet-control-layers-click-toggle" href="#" title="Open Available Layers"></a>');
    //Add scale to map
    L.control.scale({
        metric: true,
        imperial:true
    }).addTo(map);
   

    ////Add mouse position to map 
    L.control.mousePosition().addTo(map);


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
    var monthDropdown = '<div style="margin-bottom:5px;"><select id="months" name="months"></select></div>';

    $(".leaflet-control-layers-list").append(monthDropdown);

    var yearDropdown = '<div style="margin-bottom:5px;"><select id="years" name="years"></select></div>';
    $(".leaflet-control-layers-list").append(yearDropdown);

    var styleDropdown = '<div style="margin-bottom:5px;"><select id="style" name="style"></select></div>';
    $(".leaflet-control-layers-list").append(styleDropdown);


    //////////////////////////
    /////On change functions for Month, Year, Style selectors
    //////////////////////////
    $("#months").change(function () {
        map.removeLayer(hydroclim);
        hydroclimMonth = this.value;
        defaultsChanged = true;
        addHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
    });
    $("#years").change(function () {
        map.removeLayer(hydroclim);
        hydroclimYear = this.value;
        defaultsChanged = true;
        addHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
    });
    $("#style").change(function () {
        map.removeLayer(hydroclim);
        selectedStyle = this.value;
        defaultsChanged = true;
        addHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
    });
    $("#hydroclim-data").change(function () {
        map.removeLayer(hydroclim);
        if (this.checked) {
            addHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);
        }
        defaultsChanged = true;
    });

    //Recreates the main reach layer url with user's selected data as criteria
    function addHydroclimLayer(mon, year, style) {
        var viewparams = [
            'month:' + mon, 'year:' + year
        ]

        var full_url = ""
        if (defaultsChanged) {
            full_url = encodeURI(wms_url + "viewparams=" + viewparams.join(';'));
            hydroclim = new L.TileLayer.WMS(full_url,
                {
                    layers: "hydroclim:reach",
                    format: 'image/png',
                    styles: style,
                    transparent: true,
                    zIndex: 51,
                }
            ).addTo(map);
        } else {
            full_url = encodeURI(wms_url);
            hydroclim = new L.TileLayer.WMS(full_url,
                {
                    layers: "hydroclim:reach",
                    format: 'image/png',
                    styles: style,
                    transparent: true,
                    zIndex: 51,
                    tiled: true
                }
            ).addTo(map);
        }        

    }
    ///////////////////////////////////////////////////
    /////////Add data to Month, Year, Style selectors
    ///////////////////////////////////////////////////
    createYearDropdowns();
    createMonthDropdowns();
    createStylesDropdowns();

    function createMonthDropdowns() {
        var index, len;
        for (index = 0, len = months.length; index < len; ++index) {
            var month = months[index];
            var newOption = $('<option value="' + month.value + '">' + month.name + '</option>');
            $('#months').append(newOption);
        }
    }
    function createYearDropdowns() {
        var totalYears = 50;
        var startYear = 1950;
        var count = 1;

        while (count <= totalYears) {
            var newOption = $('<option value="' + startYear + '">' + startYear + '</option>');
            $('#years').append(newOption);
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
}