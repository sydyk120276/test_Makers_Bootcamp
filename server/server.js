import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import io from 'socket.io'
import fileUpload from 'express-fileupload'

import config from './config'
import mongooseService from './services/mongoose'
import sequelize from './db'
import { Registration, Login, Check } from './controllers/userController'
import {
  DeviceControllerCreate,
  DeviceControllerGetAll,
  DeviceControllerGetOne
} from './controllers/deviceController'
import { BrandControllerCreate, BrandControllergetAll } from './controllers/brandController'
import { TypeControllerCreate, TypeControllerGetAll } from './controllers/typeController'
// import { AuthMiddleware } from './middleware/authMiddleware'
// import { CheckRoleMiddleware } from './middleware/checkRoleMiddleware'
// eslint-disable-next-line
import models from './models/models'

import Html from '../client/html'

const { resolve } = require('path')

const server = express()
const httpServer = http.createServer(server)

const PORT = config.port

const middleware = [
  cors(),
  cookieParser(),
  express.json({ limit: '50kb' }),
  express.static(resolve(__dirname, 'static')),
  fileUpload({}),
  favicon(`${__dirname}/public/favicon.ico`)
]

middleware.forEach((it) => server.use(it))

// userRouter

server.post('/api/v1/user/registration', Registration)
server.post('/api/v1/user/login', Login)
server.get('/api/v1/user/auth', Check)

// typeRouter

server.post('/api/v1/type', TypeControllerCreate)
server.get('/api/v1/type', TypeControllerGetAll)

// brandRouter

server.post('/api/v1/brand', BrandControllerCreate)
server.get('/api/v1/brand', BrandControllergetAll)

// deviceRouter

server.post('/api/v1/device', DeviceControllerCreate)
server.get('/api/v1/device', DeviceControllerGetAll)
server.get('/api/v1/device/:id', DeviceControllerGetOne)

server.get('/', (req, res) => {
  res.send('Express Server')
})

// MongoDB
if (config.mongoEnabled) {
  // eslint-disable-next-line
  console.log('MongoDB Enabled: ', config.mongoEnabled)
  mongooseService.connect()
}

// SocketsIO
if (config.socketsEnabled) {
  // eslint-disable-next-line
  console.log('Sockets Enabled: ', config.socketsEnabled)
  const socketIO = io(httpServer, {
    path: '/ws'
  })

  socketIO.on('connection', (socket) => {
    console.log(`${socket.id} login`)

    socket.on('disconnect', () => {
      console.log(`${socket.id} logout`)
    })
  })
}

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    httpServer.listen(PORT, () => {
      // eslint-disable-next-line
      console.log(`Serving at http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
