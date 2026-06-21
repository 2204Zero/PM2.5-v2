// =====================================================
// HCHO + FIRE OVERLAY INDIA 2025
// =====================================================

// India Boundary
var india = ee.FeatureCollection("FAO/GAUL/2015/level0")
                .filter(ee.Filter.eq('ADM0_NAME', 'India'));

Map.centerObject(india, 5);

// =======================================
// HCHO DATA
// =======================================

var hcho = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_HCHO")
              .filterDate('2025-01-01', '2025-12-31')
              .select('tropospheric_HCHO_column_number_density');

var hchoMean = hcho.mean().clip(india);

var hchoVis = {
  min: 0,
  max: 0.0001,
  palette: [
    'blue',
    'cyan',
    'yellow',
    'orange',
    'red'
  ],
  opacity: 0.3
};

Map.addLayer(
  hchoMean,
  hchoVis,
  'HCHO Mean 2025'
);

// =======================================
// FIRE DATA
// =======================================

var fires = ee.ImageCollection("NASA/LANCE/SNPP_VIIRS/C2")
                .filterDate('2025-01-01', '2025-12-31')
                .select('frp');

var fireMean = fires.mean().clip(india);

Map.addLayer(
    fireMean,
    {
      min: 0,
      max: 1,
      opacity: 1,
      palette: [
        'yellow',
        'orange',
        'red'
      ]
    },
    'Fire Activity'
);
var stats = hchoMean.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: india.geometry(),
  scale: 1000,
  maxPixels: 1e13
});

print("HCHO Stats", stats);
// India Boundary
Map.addLayer(
    india,
    {color: 'black'},
    'India Boundary'
);