"""Gives auto complete to all env variables and wraps other config-like files."""

import os
from typing import Any


class Sentinel:
    """Stores placeholder values for function arguments. 
    Similar to Symbol in JavaScript.
    """

    def __init__(self, name=''):
        self.name = f"Sentinel({name})"

    def __repr__(self):
        return self.name


NotSet = Sentinel('NOT_SET')


def getenv(key: str, default: Any = NotSet, required=False) -> Any:
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
        return os.environ[key]

    if required and default is NotSet:
        raise EnvironmentError(
            f'The environment variable "{key}" was not found and no default was set.')


PRODUCTION = getenv('ENV', 'development') == 'production'
GOOGLE_CLIENT_ID = getenv('GOOGLE_CLIENT_ID', required=PRODUCTION)
GOOGLE_CLIENT_SECRET = getenv('GOOGLE_CLIENT_SECRET', required=PRODUCTION)
