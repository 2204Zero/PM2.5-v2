import pandas as pd
import json
import matplotlib.pyplot as plt

# ==========================
# LOAD DATA
# ==========================

fire_df = pd.read_csv("Fire_Points_2025.csv")
hcho_df = pd.read_csv("HCHO_Points_2025.csv")

# ==========================
# EXTRACT LATITUDE/LONGITUDE
# ==========================

def extract_coordinates(geo_str):
    geo = json.loads(geo_str)
    lon, lat = geo["coordinates"]
    return pd.Series([lat, lon])

fire_df[['lat', 'lon']] = fire_df['.geo'].apply(extract_coordinates)
hcho_df[['lat', 'lon']] = hcho_df['.geo'].apply(extract_coordinates)

# ==========================
# RENAME COLUMNS
# ==========================

fire_df = fire_df.rename(columns={
    'frp': 'frp'
})

hcho_df = hcho_df.rename(columns={
    'tropospheric_HCHO_column_number_density': 'hcho'
})

# ==========================
# ROUND COORDINATES
# ==========================

fire_df['lat_round'] = fire_df['lat'].round(2)
fire_df['lon_round'] = fire_df['lon'].round(2)

hcho_df['lat_round'] = hcho_df['lat'].round(2)
hcho_df['lon_round'] = hcho_df['lon'].round(2)

# ==========================
# MERGE DATASETS
# ==========================

corr_df = pd.merge(
    fire_df[['lat_round', 'lon_round', 'frp']],
    hcho_df[['lat_round', 'lon_round', 'hcho']],
    on=['lat_round', 'lon_round'],
    how='inner'
)

print("Merged Records:", len(corr_df))

# ==========================
# CORRELATION
# ==========================

corr = corr_df['frp'].corr(corr_df['hcho'])

print("\nPearson Correlation:", corr)

# ==========================
# SAVE RESULT CSV
# ==========================

corr_df.to_csv(
    "fire_hcho_correlation_data.csv",
    index=False
)

print("Correlation CSV Saved")

# ==========================
# PLOT
# ==========================

plt.figure(figsize=(8,6))

plt.scatter(
    corr_df['frp'],
    corr_df['hcho'],
    alpha=0.5
)

plt.xlabel("Fire Radiative Power (FRP)")
plt.ylabel("HCHO Concentration")

plt.title(
    f"Fire-HCHO Correlation (r={corr:.4f})"
)

plt.grid(True)

plt.savefig(
    "fire_hcho_correlation.png",
    dpi=300,
    bbox_inches='tight'
)

plt.show()

print("Correlation Plot Saved")