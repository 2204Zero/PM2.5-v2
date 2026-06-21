## cell 1
import pandas as pd
import json

df = pd.read_csv("HCHO_Points_2025.csv")

df.head()

def get_coords(geo):
    geo = json.loads(geo)
    lon, lat = geo['coordinates']
    return pd.Series([lat, lon])

df[['latitude', 'longitude']] = df['.geo'].apply(get_coords)

df.head()

## cell 2
from sklearn.preprocessing import StandardScaler

X = df[
    [
        'latitude',
        'longitude',
        'tropospheric_HCHO_column_number_density'
    ]
]

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

## cell 3
from sklearn.cluster import DBSCAN

dbscan = DBSCAN(
    eps=0.2,
    min_samples=20
)

df['cluster'] = dbscan.fit_predict(X_scaled)

df.head()

## cell 4
print(df['cluster'].value_counts())

print(
    "Total Clusters:",
    len(set(df['cluster'])) -
    (1 if -1 in df['cluster'] else 0)
)

## cell 5
import matplotlib.pyplot as plt

plt.figure(figsize=(12,8))

plt.scatter(
    df['longitude'],
    df['latitude'],
    c=df['cluster'],
    s=2
)

plt.title("HCHO Hotspots using DBSCAN")
plt.xlabel("Longitude")
plt.ylabel("Latitude")

plt.show()

## cell 6
hotspots = df[df['cluster'] != -1]

hotspots.to_csv(
    "hcho_hotspots.csv",
    index=False
)

print(hotspots.shape)