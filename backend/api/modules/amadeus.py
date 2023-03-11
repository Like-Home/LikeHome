from amadeus import Client, ResponseError  # type: ignore

from app import config

amadeus = Client(
    client_id=config.AMADEUS_API_KEY,
    client_secret=config.AMADEUS_API_SECRET
)
