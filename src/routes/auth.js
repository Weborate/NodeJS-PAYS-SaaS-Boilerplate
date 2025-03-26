import express from 'express'
import { auth } from '../config/auth.js'

export const router = express.Router()

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

// NextAuth.js routes
router.use('/api/auth', auth) 