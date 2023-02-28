# LikeHome - Frontend

## Setup

Make sure you have Node and npm installed. Then run these commands:

```bash
npm install
```

### Trouble Shooting

#### `vite:react-swc` Plugin Error

If you receive an error like:

```
[vite] Internal server error: Bindings not found.
  Plugin: vite:react-swc
  ...
```

Just run `npm install @swc/core` and try again. You can find more information about this [issue here](https://github.com/swc-project/swc/issues/1430#issuecomment-1153791356).

## Building

For a production build run the following:

```
npm run build
```

## Frameworks

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [react-router](https://reactrouter.com/)
- [recoil](https://recoiljs.org/)
