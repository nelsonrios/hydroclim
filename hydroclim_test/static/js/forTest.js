var zoomToExtent = [-73.9016799926758,40.7916450500488,-70.7246475219727,45.2246017456055]; //BBOX of layer: hydroclim_test:ma_bay_riv
var maxExtent = [-180.0,-90.0,180.0,90.0]; //BBOX of EPSG:4326

/* Load Tile Cache From Tilecache server */
var tile =  new ol.layer.Tile({
            extent: maxExtent,
            source: new ol.source.TileWMS({
                url: '/tilecache.cgi?',
                params: {
                    'LAYERS': 'hydroclim_test:ma_bay_riv',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS':'EPSG:4326'
                },
                transition: 0
          })
        })

/* Load Tile into Layer */
var layers = [
       tile
      ];

/* Load Layer in Map */
var map = new ol.Map({

        projection:"EPSG:4326",
        layers: layers,
        target: 'map',
        view: new ol.View({
            zoom: 2,
            projection:'EPSG:4326',
            maxResolution:1.406250,
            extent: zoomToExtent
        })
      });

/* Fit the view of map*/
map.getView().fit(zoomToExtent);