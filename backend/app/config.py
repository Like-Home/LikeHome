"""Gives auto complete to all env variables and wraps other config-like files."""

import os
from typing import Any

import stripe


def getenv(key: str, default: Any = None, required=False, boolean=False) -> Any:
    """Retrieves a value from the environment.

    Args:
        key (str): The variable name.
        default (Any, optional): A default value to fall back on. Defaults to NotSet.

    Raises:
        EnvironmentError: When no default has been set and the variable is not found.

    Returns:
        Any: The value of the ENV variable unless missing and default was set.
    """

    if key in os.environ:
        if boolean:
            if os.environ[key].lower() in ['true', '1']:
                return True
            elif os.environ[key].lower() in ['false', '0',]:
                return False
            raise EnvironmentError(
                f'The environment variable "{key}" requires a value in [0, 1, true, false].')
        return os.environ[key]

    if required:
        raise EnvironmentError(
            f'The environment variable "{key}" is required but was not set.')

    return default


PRODUCTION = getenv('ENV', 'development') == 'production'

GOOGLE_CLIENT_ID = getenv('GOOGLE_CLIENT_ID', required=PRODUCTION)
GOOGLE_CLIENT_SECRET = getenv('GOOGLE_CLIENT_SECRET', required=PRODUCTION)

AMADEUS_API_KEY = getenv('AMADEUS_API_KEY')
AMADEUS_API_SECRET = getenv('AMADEUS_API_SECRET')

HOTELBEDS_ENDPOINT = getenv('HOTELBEDS_ENDPOINT')
HOTELBEDS_SECURE_ENDPOINT = getenv('HOTELBEDS_SECURE_ENDPOINT')
HOTELBEDS_API_KEY = getenv('HOTELBEDS_API_KEY')
HOTELBEDS_API_SECRET = getenv('HOTELBEDS_API_SECRET')
HOTELBEDS_KEY_POOL = getenv('HOTELBEDS_KEY_POOL')
HOTELBEDS_CACHE = getenv('HOTELBEDS_CACHE', default=True, boolean=True)

STRIPE_PUBLISHABLE_KEY = getenv('STRIPE_PUBLISHABLE_KEY', required=PRODUCTION)
STRIPE_SECRET_KEY = getenv('STRIPE_SECRET_KEY', required=PRODUCTION)
STRIPE_ENDPOINT_SECRET = getenv('STRIPE_ENDPOINT_SECRET', required=PRODUCTION)


PG_FIELDS_REQUIRED = PRODUCTION and 'DATABASE_URL' not in os.environ
POSTGRES_USER = getenv('POSTGRES_USER', required=PG_FIELDS_REQUIRED)
POSTGRES_HOST = getenv('POSTGRES_HOST', required=PG_FIELDS_REQUIRED)
POSTGRES_DB = getenv('POSTGRES_DB', required=PG_FIELDS_REQUIRED)
POSTGRES_PASSWORD = getenv('POSTGRES_PASSWORD', required=PG_FIELDS_REQUIRED)
POSTGRES_PORT = int(getenv('POSTGRES_PORT',
                           default='5432',
                           required=PG_FIELDS_REQUIRED
                           ))

GOOGLE_MAPS_API_KEY = getenv('GOOGLE_MAPS_API_KEY', required=PRODUCTION)
GOOGLE_MAPS_API_SECERT = getenv('GOOGLE_MAPS_API_SECERT', required=PRODUCTION)
MONEY_SAVER_MODE = getenv('MONEY_SAVER_MODE', default=True, boolean=True)

SENDINBLUE_API_KEY = getenv('SENDINBLUE_API_KEY', required=PRODUCTION)

BASE_URL = getenv('BASE_URL', default='http://localhost:8080',
                  required=PRODUCTION)

SECRET_KEY = getenv(
    'SECRET_KEY',
    default='django-insecure-6i6ophe6dmuw@1vn!h5xw6@^g#x+pp&n6mfitr_r1%t!l7+3gj',
    required=PRODUCTION
)

stripe.api_key = STRIPE_SECRET_KEY
