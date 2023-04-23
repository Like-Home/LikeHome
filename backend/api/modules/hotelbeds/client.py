
import hashlib
import json
import pickle
import time
from collections import OrderedDict
from hashlib import md5
from logging import getLogger
from operator import itemgetter
from typing import List, Optional, Tuple

from requests import Session
from requests.adapters import HTTPAdapter, Retry

logger = getLogger('hotelbeds')


class KeyPoolOverflow(Exception):
    pass


class KeyPool:
    @classmethod
    def from_dict(cls, data: List[dict]):
        return cls([(pair['key'], pair['secret']) for pair in data])

    @classmethod
    def from_file(cls, file):
        data = json.load(file)
        return cls.from_dict(data)

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

# [{
#     "name": "Nha",
#     "key": "ac00df36f6a3bffadb3ba384582aaf9e",
#     "secret": "1c211bc731"
# },
#     {
#     "name": "Josh",
#     "key": "d41651a67b68b36d5f2dbfd28145f87d",
#     "secret": "e6062af3bf"
# },
#     {
#     "name": "Jeff Throwaway",
#     "key": "37f60277ee67df99d23144b542260e78",
#     "secret": "eda7e0129a"
# },
#     {
#     "name": "Micheal",
#     "key": "fbd965f9ca40a9d3a9b9152d5da4fcfe",
#     "secret": "a31b78b04e"
# },
#     {
#     "name": "Rishi",
#     "key": "ad2698d1ff021fb1c81a93f1d7d44d7b",
#     "secret": "3e598c20c3"
# },
#     {
#     "name": "Noah",
#     "key": "319ad69c0ecef4c79861bb616a3c30ea",
#     "secret": "a8f2bfb4b9"
# }
# ]


def generate_signature(api_key: str, secret: str) -> str:
    """Generates a signature for the Hotelbeds API.

    Args:
        api_key (str): The API key.
        secret (str): The API secret.

    Returns:
        str: The signature.
    """

    return hashlib.sha256(
        f'{api_key}{secret}{int(time.time())}'.encode('utf-8')
    ).hexdigest()


head = itemgetter(0)


def convert_to_nested_ordered_dict(d):
    return OrderedDict(
        sorted(
            ((k, convert_to_nested_ordered_dict(v))
             if isinstance(v, dict) else (k, v)
             for k, v in d.items()),
            key=head
        )
    )


class HotelbedsClient(Session):
    """A client for the Hotelbeds API."""

    def __init__(self, endpoint: str, api_key: Optional[str] = None, secret: Optional[str] = None, key_pool: Optional[KeyPool] = None, cache=None):
        super().__init__()
        self.endpoint = endpoint
        if not key_pool:
            if not api_key or not secret:
                raise ValueError(
                    'You must provide either a key_pool or an api_key and a secret combination.'
                )
            self.key_pool = None
            self.api_key = api_key
            self.secret = secret
        else:
            self.key_pool = key_pool
            self.api_key = self.key_pool.get_key()
            self.secret = self.key_pool.get_secret()

        self.cache = cache

        # in case of error, retry at most 3 times, waiting
        # at least half a second between each retry
        retry = Retry(
            total=3,
            backoff_factor=0.5,
            allowed_methods={*Retry.DEFAULT_ALLOWED_METHODS, 'POST'}
        )

        adapter = HTTPAdapter(max_retries=retry)
        self.mount('http://', adapter)
        self.mount('https://', adapter)

    def request(self, method, url, **kwargs):
        refresh_cache = kwargs.pop('refresh_cache', False)

        kwargs.setdefault('headers', {})
        kwargs['headers'].update({
            'X-Signature': generate_signature(self.api_key, self.secret),
            'Api-Key': self.api_key,
            'Content-Type': 'application/json'
        })

        if not url.startswith('http'):
            url = self.endpoint + url

        cacheable = json.dumps({
            'url': url,
            'method': method,
            'json': (kwargs.get('json') or {}),
            'data': (kwargs.get('data') or {}),
            'params': (kwargs.get('params') or {}),
        }, indent=2, sort_keys=True)

        key = md5(cacheable.encode('utf-8')).hexdigest()

        if not refresh_cache and self.cache is not None:
            logger.info(f'Using cache for {url}')
            if key in self.cache:
                return pickle.loads(self.cache[key])

        res = super().request(method, url, **kwargs)

        if res.status_code == 403 and self.key_pool is not None:
            logger.info('Rate limited for the day. Rotating keys.')
            if not self.key_pool.next_key():
                raise KeyPoolOverflow('No more keys in pool')
            self.api_key = self.key_pool.get_key(),
            self.secret = self.key_pool.get_secret()
            self.request(method, url, **kwargs)

        if self.cache is not None and res.ok:
            logger.info(f'Adding to cache {url}')
            self.cache[key] = pickle.dumps(res)

        return res


if __name__ == '__main__':
    hotelbeds = HotelbedsClient(
        input('endpoint: '),
        api_key=input('api key: '),
        secret=input('api secret: '),
    )

    res = hotelbeds.get('/hotel-api/1.0/status')
    print('response:', res)
    print('body:', res.json())
