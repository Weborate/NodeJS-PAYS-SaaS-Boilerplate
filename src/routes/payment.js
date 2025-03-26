import express from 'express'
import Stripe from 'stripe'
import { authenticatedUser } from '../middleware/auth.js'
import pool from '../config/database.js'
import { sendPaymentConfirmation } from '../services/email.js'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const router = express.Router()

router.get('/top-up', authenticatedUser, (req, res) => {
  res.render('payment/top-up', { title: 'Top Up Balance' })
})

router.post('/create-payment-intent', authenticatedUser, async (req, res) => {
  try {
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.session.user.id
      }
    })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const userId = paymentIntent.metadata.userId
    const amount = paymentIntent.amount / 100 // Convert from cents to dollars

    try {
      const conn = await pool.getConnection()
      
      // Start transaction
      await conn.beginTransaction()

      // Get user details
      const [user] = await conn.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      )

      // Create transaction record
      await conn.query(
        'INSERT INTO transactions (id, user_id, amount, type, status, stripe_payment_intent_id) VALUES (?, ?, ?, ?, ?, ?)',
        [paymentIntent.id, userId, amount, 'top_up', 'completed', paymentIntent.id]
      )

      // Update user balance
      await conn.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [amount, userId]
      )

      // Commit transaction
      await conn.commit()
      conn.release()

      // Send confirmation email
      await sendPaymentConfirmation(user, amount)
    } catch (error) {
      console.error('Error processing payment:', error)
      res.status(500).json({ error: 'Error processing payment' })
      return
    }
  }

  res.json({ received: true })
}) 