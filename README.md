# Auction Retriever Frontend

React + Vite frontend for Auction Retriever.

## Requirements

- Node.js 20+
- npm

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file (local only) based on `.env.example`:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

## Netlify Deployment

This project is configured for Netlify with `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect is enabled for client-side routing

### Deploy via Netlify UI

1. Push this project to your Git provider.
2. In Netlify, choose New site from Git.
3. Select this repository.
4. Confirm build settings:
5. Build command = `npm run build`
6. Publish directory = `dist`
7. Add environment variables in Netlify Site settings -> Environment variables:
8. `VITE_API_BASE_URL`
9. `VITE_STRIPE_PUBLISHABLE_KEY`
10. Trigger deploy.

### Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --build
netlify deploy --build --prod
```
