import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import passport from 'passport'
import { useSecurity } from './security'

import './connectMongo'

/**
 * import routers
 */
import usersRouter from './controllers/users'
import backpackRouter from './controllers/backpacks'

import passportInit from './connectPassport'
import { config } from 'dotenv'
config()
const PORT = process.env.PORT || 3001
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notex'
if (!process.env.MONGO_URI)
	console.log('Cannot find process.env.MONGO_URI. Using local database!')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
mongoose.set('useFindAndModify', false)

// implement ssecurity middleware
useSecurity(app)

// Passport middleware
app.use(passport.initialize())
// Passport config
passportInit(passport)
// Routes
app.use('/api/users', usersRouter)
app.use('/api/backpacks', backpackRouter)

/**
 * When no page was found
 * load error 404
 */
app.use((req, res) => {
	res.status(404)
	res.json({ code: 404, message: 'Route not found' })
})

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})
