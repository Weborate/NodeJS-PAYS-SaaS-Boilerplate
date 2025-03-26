import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import compression from 'compression'
import { auth } from './config/auth.js'
import { router as authRouter } from './routes/auth.js'
import { router as paymentRouter } from './routes/payment.js'
import { router as mainRouter } from './routes/main.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Middleware
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.NEXTAUTH_SECRET,
  resave: false,
  saveUninitialized: false
}))

// View engine
app.set('view engine', 'ejs')
app.set('views', './src/views')

// Routes
app.use('/auth', authRouter)
app.use('/payment', paymentRouter)
app.use('/', mainRouter)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('error', { error: err })
})

app.listen(3000, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`)
}) 