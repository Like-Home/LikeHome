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

### [Backend](backend/README.md)

### [Frontend](frontend/README.md)

### Caddy

Install Caddy:
- For Windows, a copy of `caddy.exe` is already included for easy development.
- On Linux and macOS, [install Caddy](https://caddyserver.com/docs/install) through your package manager.
  - You can also download it manually from Caddy's website if you prefer.

## Running the application

To get a complete development setup instantly, simply run: (in the root folder)
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
