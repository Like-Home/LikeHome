import diskcache as dc
from app import config

from .client import HotelbedsClient

hotelbeds = HotelbedsClient(
    config.HOTELBEDS_ENDPOINT,
    config.HOTELBEDS_API_KEY,
    config.HOTELBEDS_API_SECRET,
    cache=dc.Cache('cache') if config.MONEY_SAVER_MODE else None
)
