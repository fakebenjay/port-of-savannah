import json
from IPython import embed

f = open('tl_2021_us_county.json')

data = json.load(f)
features = data['features']

chatham = list(filter(lambda f: 'Chatham' in f["properties"]["NAME"] and '13' in f["properties"]["STATEFP"], features))
bryan = list(filter(lambda f: 'Bryan' in f["properties"]["NAME"] and '13' in f["properties"]["STATEFP"], features))
effingham = list(filter(lambda f: 'Effingham' in f["properties"]["NAME"] and '13' in f["properties"]["STATEFP"], features))

counties = chatham + bryan + effingham

for c in counties:
    c["properties"]["NAME"] = c["properties"]["NAME"].replace(" county", "")

data['features'] = counties

with open('counties.json', 'w') as f:
    json.dump(data, f)
