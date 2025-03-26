import { getSession } from "@auth/express"

export const auth = async (req, res, next) => {
  const session = await getSession(req)
  if (!session?.user) {
    return res.redirect('/auth/login')
  }
  next()
} 