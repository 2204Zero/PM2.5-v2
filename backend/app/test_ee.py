import ee

ee.Initialize(project="aqi-hack")

hcho = ee.ImageCollection(
    "COPERNICUS/S5P/OFFL/L3_HCHO"
)

print(
    "Images:",
    hcho.size().getInfo()
)