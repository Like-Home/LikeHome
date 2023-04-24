import diskcache as dc
from app import config

from .client import HotelbedsClient, KeyPool

kwargs = {}

if config.HOTELBEDS_KEY_POOL:
    kwargs['key_pool'] = KeyPool([
        tuple(pair.split(',')) for pair in config.HOTELBEDS_KEY_POOL.strip(';').split(';')
    ])
else:
    kwargs['api_key'] = config.HOTELBEDS_API_KEY
    kwargs['secret'] = config.HOTELBEDS_API_SECRET

if config.HOTELBEDS_CACHE:
    kwargs['cache'] = dc.Cache('cache')

hotelbeds = HotelbedsClient(
    endpoint=config.HOTELBEDS_ENDPOINT,
    **kwargs
)
