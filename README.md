# LikeHome

## Folders
- `/backend`    - The API server that servers files and handles interactions from the web application frontend.
- `/frontend`
  - `./src/`    - The API server that servers files and handles interactions from the web application frontend.
  - `./public/` - The web React app frontend.

## Resources

- [React](https://reactjs.org/)
- [Django](https://www.djangoproject.com/)
- [Building a React.js Application using Django REST Framework](https://www.section.io/engineering-education/react-and-django-rest-framework/)

## Setup

### Backend

Make sure you have Python 3.11 installed with Potry. To install Poetry, run `python -m pip install poetry` in your terminal.

**NOTE**: On Windows you might need to replace python with  `py -3.11` instead.

```
cd backend
python -m poetry install
python -m poetry shell
python manage.py migrate
python manage.py makemigrations
python manage.py migrate --run-syncdb
python manage.py createsuperuser
```

### Frontend

Coming soon...

## Running the application

### Backend

```
cd backend
python manage.py runserver
```


### Frontend

Coming soon...
