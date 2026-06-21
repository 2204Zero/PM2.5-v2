// ======================================================
// INDIA HCHO MAP - YEAR 2025
// Dataset: COPERNICUS/S5P/OFFL/L3_HCHO
// Band: tropospheric_HCHO_column_number_density
// ======================================================

// 1. India Boundary
var india = ee.FeatureCollection("FAO/GAUL/2015/level0")
                .filter(ee.Filter.eq('ADM0_NAME', 'India'));

Map.centerObject(india, 5);

// 2. Load HCHO Dataset
var hcho = ee.ImageCollection(
    "COPERNICUS/S5P/OFFL/L3_HCHO"
)
.filterDate('2025-01-01', '2025-12-31')
.select('tropospheric_HCHO_column_number_density');

// 3. Calculate Mean HCHO for 2025
var hcho_mean = hcho.mean().clip(india);

// 4. Visualization Parameters
var visParams = {
  min: 0,
  max: 0.0003,
  palette: [
    'blue',
    'cyan',
    'yellow',
    'orange',
    'red'
  ]
};

// 5. Add HCHO Layer
Map.addLayer(
    hcho_mean,
    visParams,
    'HCHO Mean 2025'
);

// 6. India Boundary
Map.addLayer(
    india,
    {color: 'black'},
    'India Boundary'
);

// 7. Print Dataset Information
print("Total HCHO Images:", hcho.size());

print(
  "HCHO Statistics",
  hcho_mean.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: india.geometry(),
    scale: 10000,
    maxPixels: 1e13
  })
);