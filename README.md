# LikeHome

## Folders

- `/backend` - The Django backend API server.
- `/frontend` - The React web app frontend.

## Resources

- [React](https://reactjs.org/)
- [Django](https://www.djangoproject.com/)
- [Django Quick Tutorial Example](https://docs.djangoproject.com/en/4.1/intro/tutorial01/)
- [Building a React.js Application using Django REST Framework](https://www.section.io/engineering-education/react-and-django-rest-framework/)
- [dbdiagram.io - Visualize dbml Files](https://dbdiagram.io/)
- [Caddy](https://caddyserver.com/docs/caddyfile)

#### Recommended Software

- [Postman](https://www.postman.com/downloads/) Testing requests to backend & other external API's
- [SQLite](https://sqlitebrowser.org/) Browsing data in database
- [Signal](https://signal.org/en/download/) E2e private messenger for sending/receiving secret tokens

## Setup

### Requirements

- [Node.js 18](https://nodejs.org/en/download/)
- [Python 3.11](https://www.python.org/downloads/)
- [Caddy](https://caddyserver.com/docs/install)
- [Poetry](https://github.com/python-poetry/poetry) (will be installed automatically)

To install Caddy:
- For Windows, a copy of `caddy.exe` is already included for easy development.
- On Linux and macOS, [install Caddy](https://caddyserver.com/docs/install) through your package manager.
  - You can also download it manually from Caddy's website if you prefer.

### Running

Now run the following: (replace `python` with whatever command you use for Python 3)
```
python setup.py
```

You only need to run `setup.py` once **after first cloning** the repo or **after pulling** the latest changes (when dependencies or the DB model have changed).

If everything succeeded, you can now start the app any time with:
```
node run.js
```

By default the app will run on http://localhost:8080

To create an account for the Django admin console, run `py setup.py admin` and enter a username and password.

## Environment

Our project will use a `.env` file that contains different variables and secrets that will be used for both development and production.
Contact @NoahCardoza#3669 for more info regarding the Google client_id and secrets, which will be sent via Signal Messenger.

- Development: To get started, copy the sample .env file to the project root directory with the filename: `.env`.
- Production: Same as above, but save file as: `prod.env`.

To emulate production mode (will run on port 80) without Docker:

```
cd frontend
npm run build
cd ..
node run.js production
```

## Auto-Formatting

If you are using VSCode, you can simply copy `.vscode/settings.example.json` to `.vscode/settings.json`
and install the [recommended extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#_recommended-extensions)
inside `.vscode/extensions.json`.

## Docker

Use the following command to spin up all the containers:

```
docker-compose up
```

**NOTE**: You can run these following commands in parallel in another terminal.

If it's your first time, you'll need to apply the migrations:

```
docker compose run backend python manage.py migrate --run-syncdb
docker compose run backend python manage.py createsuperuser
```

If you install any dependencies in the backend, you'll need to rebuild the image:

```
docker compose build backend
```

If you make any changes to the frontend, you'll need to run it again:

```
docker compose up frontend
```
