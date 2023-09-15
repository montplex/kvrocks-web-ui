const express = require('express')
const proxy = require('express-http-proxy')
const app = express()

const targetApiAddress =
  process.env.TARGET_API_ADDRESS || 'http://192.168.1.15:9379'
console.log('target api address: ' + targetApiAddress)

app.use(express.static('../dist'))
app.use(
  '/api',
  proxy(targetApiAddress, {
    proxyReqPathResolver: function (req) {
      return '/api' + req.url
    },
  }),
)

console.log('listening on port 19379')
app.listen(19379)
