import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})

export const sendPaymentConfirmation = async (user, amount) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Payment Confirmation',
      text: `Dear ${user.name},\n\nYour payment of $${amount} has been processed successfully.\n\nThank you for your business!`,
      html: `
        <h1>Payment Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Your payment of $${amount} has been processed successfully.</p>
        <p>Thank you for your business!</p>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Payment confirmation email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending payment confirmation email:', error)
    throw error
  }
} 