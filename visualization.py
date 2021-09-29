import pandas as pd
import folium
from geopy.geocoders import Nominatim

hotspot_data = pd.read_csv("hotspot_data.csv")

map = folium.Map(location = [36.018199, -78.920564], zoom_start = 10)
geolocator = Nominatim(user_agent="application")

def add_to_map(latitude, longitude, name, color = 'blue'):
  folium.Marker(location = [latitude, longitude], popup = name, icon = folium.Icon(color = color)).add_to(map)

for x in range(hotspot_data['Address'].size):

  addr_to_use = hotspot_data['Address'][x]
  location = geolocator.geocode(addr_to_use)
  if str(location) != "None":
    if hotspot_data['major hotspot?'][x] == 'yes':
      add_to_map(location.latitude, location.longitude, hotspot_data['Name'][x], 'red')
    else:
      add_to_map(location.latitude, location.longitude, hotspot_data['Name'][x])

map.save("visualization_code.html")

