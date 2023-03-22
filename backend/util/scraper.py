import json
import traceback
from typing import List, Tuple

import config
from api.modules.hotelbeds import HotelbedsClient
from resources import APIResource, api_resources


class KeyPool:
    @classmethod
    def from_file(cls, file):
        data = json.load(file)
        return cls([(pair['key'], pair['secret']) for pair in data])

    def __init__(self, key_pool: List[Tuple[str, str]]):
        """
        Args:
            key_pool (Tuple[str, str]): array of tuples (key, secret)
        """
        self.key_pool = key_pool
        self.cur_key = 0

    def get_key(self):
        return self.key_pool[self.cur_key][0]

    def get_secret(self):
        return self.key_pool[self.cur_key][1]

    def next_key(self):
        self.cur_key += 1
        return self.cur_key < len(self.key_pool)

    def reset(self):
        self.cur_key = 0


with open('keys.json', 'r') as file:
    key_pool = KeyPool.from_file(file)


def content_scrape(key_pool: KeyPool, resource: APIResource):
    collected_records = []
    from_index = 1
    to_index = 1000
    total_index = 1000

    try:
        client = HotelbedsClient(
            config.api_base_url, key_pool.get_key(), key_pool.get_secret())
        # This code assumes there are 1000 minimum hotels in the US lol
        while from_index < total_index:
            res = client.get(resource.create_url(from_index, to_index))
            # Convert response into json dictionary
            res_json = res.json()
            print(res)
            # If quota exceeded
            if res.status_code == 403:
                if not key_pool.next_key():
                    raise Exception('No more keys in pool')
                client = HotelbedsClient(
                    config.api_base_url,
                    key_pool.get_key(),
                    key_pool.get_secret()
                )
                continue
            # Add date to our combined list of destinations
            collected_records.extend(resource.extract_from_response(res_json))
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
    except Exception as e:
        traceback.print_exc()

    resource.write(collected_records)


def scrape():
    for resource in api_resources:
        print('Scraping:', resource)
        content_scrape(key_pool, resource)


if __name__ == '__main__':
    scrape()
