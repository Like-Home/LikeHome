import hashlib
import time

from app import config
from requests import Session


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


class HotelbedsClient(Session):
    """A client for the Hotelbeds API."""

    def __init__(self, endpoint: str, api_key: str, secret: str):
        super().__init__()
        self.endpoint = endpoint
        self.api_key = api_key
        self.secret = secret

    def request(self, method, url, **kwargs):
        kwargs.setdefault('headers', {})
        kwargs['headers'].update({
            'X-Signature': generate_signature(self.api_key, self.secret),
            'Api-Key': self.api_key,
            'Content-Type': 'application/json'
        })

        if not url.startswith('http'):
            url = self.endpoint + url

        return super().request(method, url, **kwargs)


hotelbeds = HotelbedsClient(
    config.HOTELBEDS_ENDPOINT,
    config.HOTELBEDS_API_KEY,
    config.HOTELBEDS_API_SECRET
)

if __name__ == '__main__':
    res = hotelbeds.get('/hotel-api/1.0/status')
    print('response:', res)
    print('body:', res.json())
