import express from 'express'
import { auth } from '../config/auth.js'
import { getSession } from "@auth/express"

export const router = express.Router()

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' })
})

router.get('/logout', async (req, res) => {
  const session = await getSession(req)
  if (session) {
    req.session.destroy()
  }
  res.redirect('/')
})

// Auth.js routes
router.use('/api/auth', auth) 