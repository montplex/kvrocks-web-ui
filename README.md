# Kvrocks Cluster Controller Web UI

node.js >= 16.0.0

## API 🔗

https://kvrocks-web.apifox.cn/

## Project Setup

### Build Frontend

```sh
npm install -g pnpm
pnpm install
pnpm run build
```

### Build Http Server

```sh
docker build -t kvrocks-web .
```

### Run Http Server

Change the value of `TARGET_API_ADDRESS` to the API address of kvrocks controller server.

```sh
docker run -d -p 19379:19379 --name kvrocks-web -e TARGET_API_ADDRESS=http://127.0.0.1:9379 kvrocks-web
```

###   

## Debug Frontend

### Configure the API address

Edit `.env.development` file, and change the value of `VITE_API_URL` to the API address of the development environment.

```sh
# kvrocks controller server address
VITE_API_URL= http://localhost:9379
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
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
