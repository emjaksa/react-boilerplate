import path from 'path'
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import renderApp from './renderApp'

dotenv.config()

const { PORT = 8080 } = process.env

const app = express()

app.enable('trust proxy')
// setup the logger

app.use(
  helmet({
    ieNoOpen: true,
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    // noSniff doesn't work with streams
    noSniff: false,
    xssFilter: true,
  }),
)
app.use(compression())
app.set('views', __dirname)
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', renderApp)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}!`)
})
