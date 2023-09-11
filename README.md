# Kvrocks Web

# Kvrocks Web

node.js >= 16.0.0

## Project Setup

```sh
pnpm install
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

Edit `.env.development` file

```sh
VITE_API_URL= http://localhost:8080
```
