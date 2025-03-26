import { ExpressAuth } from '@auth/express'
import GoogleProvider from '@auth/core/providers/google'
import GithubProvider from '@auth/core/providers/github'
import EmailProvider from '@auth/core/providers/email'
import { sendEmail } from '../services/mailgun.js'
import dotenv from 'dotenv'

dotenv.config()

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    EmailProvider({
      server: {
        host: 'api.mailgun.net',
        port: 443,
        auth: {
          user: 'api',
          pass: process.env.MAILGUN_API_KEY
        }
      },
      from: process.env.MAILGUN_FROM_EMAIL,
      sendVerificationRequest: async ({ identifier, url }) => {
        const { host } = new URL(url)
        await sendEmail({
          to: identifier,
          subject: `Sign in to ${host}`,
          text: `Click here to sign in: ${url}`,
          html: `
            <h1>Sign in to ${host}</h1>
            <p>Click the link below to sign in:</p>
            <a href="${url}">Sign in</a>
          `
        })
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login'
  }
}

export const auth = ExpressAuth(authConfig) 