# LikeHome

## Resources

- [Django](https://www.djangoproject.com/)

## Setup

Make sure you have Python 3.11 installed with Poetry. To install Poetry, run `python -m pip install poetry` in your terminal.

**NOTE**: On Windows you might need to replace python with  `py -3.11` instead.

```bash
python -m poetry install
python -m poetry shell
python manage.py migrate
python manage.py makemigrations
python manage.py migrate --run-syncdb
python manage.py createsuperuser
```