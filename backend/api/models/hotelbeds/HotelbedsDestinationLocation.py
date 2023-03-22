from django.db.models import CharField, Model


class HotelbedsDestinationLocation(Model):
    code = CharField(max_length=5, primary_key=True)
    name = CharField(max_length=100)
    countryCode = CharField(max_length=3)
    isoCode = CharField(max_length=3)

    def _str_(self):
        return f'HotelbedsDestinationLocation<{self.pk}, "{self.name}">'
