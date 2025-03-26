import formData from 'form-data'
import Mailgun from 'mailgun.js'
import dotenv from 'dotenv'

dotenv.config()

const mailgun = new Mailgun(formData)
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
})

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const messageData = {
      from: process.env.MAILGUN_FROM_EMAIL,
      to,
      subject,
      text,
      html
    }

    const response = await client.messages.create(process.env.MAILGUN_DOMAIN, messageData)
    return response
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to API Product!'
  const text = `Welcome ${user.name}! Thank you for joining our platform.`
  const html = `
    <h1>Welcome ${user.name}!</h1>
    <p>Thank you for joining our platform. We're excited to have you on board!</p>
    <p>You can now start using our API services.</p>
  `

  return sendEmail({
    to: user.email,
    subject,
    text,
    html
  })
}

export const sendPaymentConfirmation = async (user, amount) => {
  const subject = 'Payment Confirmation'
  const text = `Your payment of $${amount} has been processed successfully.`
  const html = `
    <h1>Payment Confirmation</h1>
    <p>Dear ${user.name},</p>
    <p>Your payment of $${amount} has been processed successfully.</p>
    <p>Thank you for your business!</p>
  `

  return sendEmail({
    to: user.email,
    subject,
    text,
    html
  })
} 