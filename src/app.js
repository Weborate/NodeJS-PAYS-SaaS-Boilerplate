import express from 'express'
import helmet from 'helmet'
import { helmetConfig } from './config/contentSecurityPolicy.js'
import compression from 'compression'
import { ExpressAuth } from "@auth/express"
import expressLayouts from 'express-ejs-layouts'
import { authConfig } from './config/authConfig.js'
import { router as paymentRouter } from './routes/payment.js'
import { router as mainRouter } from './routes/main.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

// Middleware
app.use(helmet(helmetConfig))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// View engine setup
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', './src/views')
app.set('layout', 'layout')
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)
// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true)

// Routes
app.use("/auth/*", ExpressAuth(authConfig))
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