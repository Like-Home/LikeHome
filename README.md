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


### Downloads
#### Required Software
- [Javascript 18](https://nodejs.org/en/download/)
- [Python 3.11](https://www.python.org/downloads/)
- [Caddy](https://caddyserver.com/docs/install)
- [Poetry](https://github.com/python-poetry/poetry) 

#### Recommended Software
- [Postman](https://www.postman.com/downloads/) Testing requests to backend & other external API's
- [SQLite](https://sqlitebrowser.org/) Browsing data in database
- [Signal](https://signal.org/en/download/) E2e private messenger for sending/receiving secret tokens

### Backend
Follow the steps outlined in the
[Backend setup guide](backend/README.md) 

### Frontend
Follow the steps outlined in the [Frontend setup guide](frontend/README.md)

### Environment
Our project will use a .env file that contains different variables and secrets that will be used for both development and production.
Contact @ncardoza for more info regarding the Google client_id and secrets, which will be sent via [Signal Messenger](https://signal.org/en/download/).

#### Development
To get started, copy the sample .env file to the project root directory with the filename: `.env`.

#### Production
Same as above, but save file as: `prod.env`.

### Caddy

Install Caddy:
- For Windows, a copy of `caddy.exe` is already included for easy development.
- On Linux and macOS, [install Caddy](https://caddyserver.com/docs/install) through your package manager.
  - You can also download it manually from Caddy's website if you prefer.

## Running the application
After following the setup directions in both backend & frontend README file,
to get a complete development setup instantly, enter the poetry virtual envaironment shell and run this command in the project's root folder.
This will start the Django, Caddy and Vite instances. You can access the development app on http://localhost:80
```
node run.js
```

To emulate production mode without Docker:
```
cd frontend
npm run build
cd ..
node run.js production
```
