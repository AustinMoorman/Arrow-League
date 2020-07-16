const express = require('express')

const apiRouter = express.Router()

const registerRouter = require('./register')
const loginRouter = require('./login')
const authRouter = require('./auth')

apiRouter.use('/register', registerRouter)
apiRouter.use('/login', loginRouter)
apiRouter.use('/auth', authRouter)

module.exports = apiRouter