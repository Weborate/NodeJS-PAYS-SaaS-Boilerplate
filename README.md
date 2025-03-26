# API Product Frontend

A Node.js pay-as-you-go SaaS boilerplate with authentication and payment integration.

## Features

- User authentication with Email (magic link), Google, and GitHub
- Payment processing with Stripe
- Modern UI with Tailwind CSS
- MariaDB database integration

## Prerequisites

- Docker

## Setup

1. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```

2. Update the following variables in `.env`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `MAILGUN_API_KEY`
   - `MAILGUN_DOMAIN`

3. Start the application:
   ```bash
   docker compose up
   ```

The application will be available at `http://localhost:3000`

## Development

For development with hot-reload:
```bash
docker compose run --rm app npm run dev
```

## Project Structure

```
src/
├── config/         # Configuration files
├── middleware/     # Express middleware
├── routes/         # Route handlers
└── views/          # EJS templates
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 