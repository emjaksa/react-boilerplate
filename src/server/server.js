import path from 'path'
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import mongoose from 'mongoose'
import graphqlHTTP from 'express-graphql'
// import passport from 'passport'
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { stream, logger } from './logger'
import renderApp from './renderApp'
import schema from '../data/schema'

dotenv.config()

const { PORT = 8080, MONGODB_URI } = process.env

const app = express()

app.enable('trust proxy')
// setup the logger
app.use(morgan('combined', { stream }))

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

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI env variable must be set.')
}

;(async () => {
  // const opts = {}
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  // opts.secretOrKey = 'secret'
  // opts.issuer = 'accounts.examplesoft.com'
  // opts.audience = 'yoursite.net'
  // passport.use(
  //   new JwtStrategy(opts, (payload, done) => {
  //     console.log(payload)
  //     return done(null, {
  //       id: '1234567890',
  //       email: 'emjaksa@gmail.com',
  //     })
  //   }),
  // )

  mongoose.connect(MONGODB_URI, {
    reconnectTries: 30,
  })

  try {
    await mongoose.connection
    logger.info('Mongoose default connection open')
  } catch (error) {
    logger.error(`Mongoose default connection error: ${error}`)
  }

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  )

  app.get('*', renderApp)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}!`)
  })
})()
