import json
from IPython import embed

f = open('tl_2021_13_place.json')

data = json.load(f)
features = data['features']

savannah = list(filter(lambda f: 'Savannah' in f["properties"]["NAME"], features))
pooler = list(filter(lambda f: 'Pooler' in f["properties"]["NAME"], features))
bloomingdale = list(filter(lambda f: 'Bloomingdale' in f["properties"]["NAME"], features))

cities = savannah + pooler + bloomingdale

for c in cities:
    c["properties"]["NAME"] = c["properties"]["NAME"].replace(" city", "")

data['features'] = cities

with open('cities.json', 'w') as f:
    json.dump(data, f)
