import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import compression from 'compression'
import expressLayouts from 'express-ejs-layouts'
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

// Trust proxy for HTTPS
app.set('trust proxy', true)

app.use(session({
  secret: process.env.NEXTAUTH_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}))

// View engine setup
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', './src/views')
app.set('layout', 'layout')
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)

// Routes
app.use('/auth', authRouter)
app.use('/api/payments', paymentRouter)
app.use('/', mainRouter)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('error', { 
    error: err,
    title: 'Error'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 