import json
from IPython import embed

f = open('tl_2021_13_prisecroads.json')
f2 = open('tl_2021_13051_roads.json')

data = json.load(f)
features = data['features']

data2 = json.load(f2)
features2 = data2['features']

interstate16 = list(filter(lambda f: 'I- 16' in f["properties"]["FULLNAME"], features))
interstate516 = list(filter(lambda f: 'I- 516' in f["properties"]["FULLNAME"], features))
interstate95 = list(filter(lambda f: 'I- 95' in f["properties"]["FULLNAME"], features))
jimmy = list(filter(lambda f: 'Jimmy Deloach' in f["properties"]["FULLNAME"], features2))

roads = jimmy + interstate16 + interstate516 + interstate95

for r in roads:
    r["properties"]["FULLNAME"] = r["properties"]["FULLNAME"].replace("I- ", "I-")
    r["properties"]["FULLNAME"] = r["properties"]["FULLNAME"].replace("Jimmy Deloach Pkwy", "Jimmy DeLoach Pkwy/GA-17")

data['features'] = roads

with open('roads.json', 'w') as f:
    json.dump(data, f)
