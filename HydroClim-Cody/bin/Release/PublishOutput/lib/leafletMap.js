var mapopts = {
    fullscreenControl: true
};
var map;



function initMap() {
    ///Hydroclim variables
    var hydroclim;
    var wmts_url = "http://maps.hydroclim.org/geoserver/gwc/service/wmts?";
    var wms_cache_url = "http://maps.hydroclim.org/geoserver/gwc/service/wms?";
    var wms_url = "http://maps.hydroclim.org/geoserver/wms?";
    var hydroclimMonth = 1;
    var hydroclimYear = 1999;
    var hydroclimStyles = [{ name: "Temperature", value: "hydroclim:temperature" }, { name: "Flow", value: "hydroclim:flow" }];
    var months = [{ name: "January", value: 1 }, { name: "February", value: 2 }, { name: "March", value: 3 }, { name: "April", value: 4 }, { name: "May", value: 5 }, { name: "June", value: 6 }, { name: "July", value: 7 }, { name: "August", value: 8 }, { name: "September", value: 9 }, { name: "October", value: 10 }, { name: "November", value: 11 }, { name: "December", value: 12 }];
    var selectedStyle = 'hydroclim:temperature';
    var defaultsChanged = false;

    /////////

    ///////Create map
    map = L.map('map', mapopts).setView([35.513151077520035, -96.416015625], 3);

    ///////Map 
    var roadMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'roadmap'
    });

    var satMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'satellite'
    }).addTo(map);

    var terrainMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'terrain'
    });

    var hybridMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'hybrid'
    });

    var styleMutant = L.gridLayer.googleMutant({
        styles: [
            { elementType: 'labels', stylers: [{ visibility: 'off' }] },
            { featureType: 'water', stylers: [{ color: '#444444' }] },
            { featureType: 'landscape', stylers: [{ color: '#eeeeee' }] },
            { featureType: 'road', stylers: [{ visibility: 'off' }] },
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
            { featureType: 'administrative', stylers: [{ visibility: 'off' }] },
            { featureType: 'administrative.locality', stylers: [{ visibility: 'off' }] }
        ],
        maxZoom: 24,
        type: 'roadmap'
    });
    
    addHydroclimLayer(hydroclimMonth, hydroclimYear, selectedStyle);

    //L.control.layers({
    //    'Google Streets': roadMutant,
    //    'Google Satellite': satMutant,
    //    'Google Aerial': terrainMutant,
    //    'Google Hybrid': hybridMutant,
    //    Styles: styleMutant,
    //}).addTo(map);
    L.control.scale({
        metric: true,
        imperial:true
    }).addTo(map);
    L.control.mousePosition().addTo(map);
    L.DomUtil.addClass(map._container, 'crosshair-cursor-enabled');
    var grid = L.gridLayer({
        attribution: 'Grid Layer',
        //      tileSize: L.point(150, 80),
        //      tileSize: tileSize
    });

    grid.createTile = function (coords) {
        var tile = L.DomUtil.create('div', 'tile-coords');
        tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');

        return tile;
    };

    map.addLayer(grid);


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


    var monthDropdown = L.control({ position: 'topright' });
    monthDropdown.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = ' <select id="months" name="months"></select>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    }
    monthDropdown.addTo(map);

    var yearDropdown = L.control({ position: 'topright' });
    yearDropdown.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = ' <select id="years" name="years"></select>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    }
    yearDropdown.addTo(map);

    var styleDropdown = L.control({ position: 'topright' });
    styleDropdown.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = ' <select id="style" name="style"></select>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    }
    styleDropdown.addTo(map);

    var displayBasinCheckbox = L.control({ position: 'topright' });
    displayBasinCheckbox.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = ' <input type="checkbox" id="showBasin" name="showBasin" checked/><label style="color:white;" for="showBasin">Display Basin</label>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    }
    displayBasinCheckbox.addTo(map);
    
    var displaySubbasinCheckbox = L.control({ position: 'topright' });
    displaySubbasinCheckbox.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = ' <input type="checkbox" id="showSubbasin" name="showSubbasin" checked/><label style="color:white;" for="showSubbasin">Display Sub-basin</label>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    }
    displaySubbasinCheckbox.addTo(map);

    createYearDropdowns();
    createMonthDropdowns();
    createStylesDropdowns();
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
    $("#showSubbasin").click(function () {
        if (!$("#showSubbasin").is(':checked')) {
            map.removeLayer(subbasin);
        } else {
            map.addLayer(subbasin)
        }
    });
    $("#showBasin").change(function () {
        if (!$("#showBasin")[0].checked) {
            map.removeLayer(basin);
        } else {
            map.addLayer(basin)
        }
    });

    var subbasin = new L.TileLayer.WMS(wms_url,
        {
            layers: "hydroclim:subbasin",
            format: 'image/png',
            transparent: true,
            zIndex: 49,
            tiled: true
        }
    ).addTo(map);
    var basin = new L.TileLayer.WMS(wms_url,
        {
            layers: "hydroclim:basin",
            format: 'image/png',
            transparent: true,
            zIndex: 50,
            tiled: true
        }
    ).addTo(map);

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