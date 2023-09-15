# Kvrocks Web


node.js >= 16.0.0

## Project Setup


```sh
pnpm install
```


**Please configure the API first**

Edit `.env.development` file, and change the value of `VITE_API_URL` to the API address of the development environment.

```sh
VITE_API_URL= http://localhost:8080
```


### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
# Type check
pnpm typecheck

# Code specification verification
pnpm lint

# Repair during verification
pnpm lint:fix
```

## Configure API address link for production environment

Edit `.env.production` file, and change the value of `VITE_API_URL` to the API address of the production environment.

```sh
VITE_API_URL= http://api/Kvrocks-web
```
