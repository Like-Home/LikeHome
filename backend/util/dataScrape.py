import json
from backend.api.modules.hotelbeds import HotelbedsClient
base_url = 'https://api.test.hotelbeds.com/'

# Array of tuples (key, secret)
cur_key = 0
key_pool = list()
combined_destinations = list()
# Populate the key_pool from key file
with open('keys.json', 'r') as file:
    data = json.load(file)
    for keypair in data:
        key_pool.append((keypair['key'], keypair['secret']))

from_index = 1
to_index = 1000
total_index = 1000

# This code assumes there are 1000 minimum hotels in the US lol
while from_index < total_index:
    # Create the client
    client = HotelbedsClient(base_url, key_pool[cur_key][0], key_pool[cur_key][1])
    # Construct the request
    url_params = f'/hotel-content-api/1.0/locations/destinations?fields=all&countryCodes=US&language=ENG&from={from_index}&to={to_index}&useSecondaryLanguage=false'
    # Get the response
    res = client.get(url_params)
    # Convert response into json dictionary
    res_json = res.json()
    # If quota exceeded
    if res.status_code == 403:
        # switch to the next key in the key pool
        cur_key += 1
        # restart this request
        continue
    # Add date to our combined list of destinations
    combined_destinations.extend(res_json['destinations'])
    # Get total amount of data from response
    total_index = res_json["total"]
    # Set the starting index to be one after left off
    from_index = to_index + 1
    # If there are less than 1000 elements left, get the remaining few
    to_index = min(total_index, to_index + 1000)
    # if (total_index - to_index) < 1000:
    #     to_index = total_index
    # # Otherwise, get another 1000 destinations
    # else:
    #     to_index += 1000

with open('destinations.json', 'w') as outfile:
    json.dump(combined_destinations, outfile, indent=2)
