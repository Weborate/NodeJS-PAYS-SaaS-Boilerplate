export const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https:"],
            formAction: ["'self'"],
            upgradeInsecureRequests: []
        }
    }
  }