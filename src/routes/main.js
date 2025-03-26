import express from 'express'
import { auth } from '../middleware/auth.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' })
})

router.get('/dashboard', auth, (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard',
    user: req.session.user
  })
}) 