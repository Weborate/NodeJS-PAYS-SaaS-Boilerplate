import express from 'express'
import { authenticatedUser } from '../middleware/auth.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' })
})

router.get('/login', (req, res) => {
  const { session } = res.locals
  res.render('login', { title: 'Login', session: session })
})

router.get('/dashboard', authenticatedUser, (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard',
    user: req.session.user
  })
}) 