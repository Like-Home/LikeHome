# LikeHome

## Folders
- `/backend`    - The Django backend API server.
- `/frontend`   - The React web app frontend.

## Resources

- [React](https://reactjs.org/)
- [Django](https://www.djangoproject.com/)
- [Building a React.js Application using Django REST Framework](https://www.section.io/engineering-education/react-and-django-rest-framework/)
- [dbdiagram.io - Visualize dbml Files](https://dbdiagram.io/)
- [Caddy](https://caddyserver.com/docs/caddyfile)

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

Make sure you have npm installed. Then run these commands:
```
cd frontend
npm install
```

Install Caddy:
- For Windows, a copy of `caddy.exe` is already included for easy development.
- On Linux and macOS, [install Caddy](https://caddyserver.com/docs/install) through your package manager.
  - You can also download it manually from Caddy's website if you prefer.

For a production build do:
```
cd frotend
npm run build
```

## Running the application

To get a complete development setup instantly, simply run: (in the root folder)
```
node run.js
```

To emulate production mode without Docker you can do:
```
node run.js production
```
