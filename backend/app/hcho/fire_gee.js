// ======================================================
// INDIA FIRE ACTIVITY MAP - 2025
// Dataset: NASA/LANCE/SNPP_VIIRS/C2
// ======================================================

// 1. India Boundary
var india = ee.FeatureCollection("FAO/GAUL/2015/level0")
                .filter(ee.Filter.eq('ADM0_NAME', 'India'));

Map.centerObject(india, 5);

// 2. Load VIIRS Fire Dataset
var fires = ee.ImageCollection("NASA/LANCE/SNPP_VIIRS/C2")
                .filterDate('2025-01-01', '2025-12-31');

// 3. Count Images
print("First Fire Image", fires.first());

// 4. Create Mean Fire Layer
var fireMean = fires
                  .select('frp')
                  .mean()
                  .clip(india);

// 5. Display Fire Layer
Map.addLayer(
    fireMean,
    {
      min: 0,
      max: 1,
      palette: ['black', 'yellow', 'orange', 'red']
    },
    'Fire Activity 2025'
);
var stats = fireMean.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: india.geometry(),
  scale: 1000,
  maxPixels: 1e13
});

print("FRP Stats", stats);
// 6. India Boundary
Map.addLayer(
    india,
    {color: 'white'},
    'India Boundary'
);