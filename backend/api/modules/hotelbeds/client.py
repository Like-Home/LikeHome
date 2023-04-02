
import hashlib
import json
import pickle
import time
from collections import OrderedDict
from hashlib import md5
from logging import getLogger
from operator import itemgetter

from requests import Session

logger = getLogger('hotelbeds')


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

    def __init__(self, endpoint: str, api_key: str, secret: str, cache=None):
        super().__init__()
        self.endpoint = endpoint
        self.api_key = api_key
        self.secret = secret
        self.cache = cache

    def request(self, method, url, **kwargs):
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

        if self.cache is not None:
            logger.info(f'Using cache for {url}')
            if key in self.cache:
                return pickle.loads(self.cache[key])

        res = super().request(method, url, **kwargs)

        if self.cache is not None and res.ok:
            logger.info(f'Adding to cache {url}')
            self.cache[key] = pickle.dumps(res)

        return res


if __name__ == '__main__':
    hotelbeds = HotelbedsClient(
        input('endpoint: '),
        input('api key: '),
        input('api secret: '),
    )
    res = hotelbeds.get('/hotel-api/1.0/status')
    print('response:', res)
    print('body:', res.json())
