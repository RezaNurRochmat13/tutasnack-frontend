# TutaSnack Frontend

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build for Cloudflare Pages

```bash
npm run build
npm run cf-deploy
```

## Project Structure

```
components/    # Vue components
  ui/          # shadcn-style UI components (Button, Card, Input, etc.)
shared/        # Utility functions, types, composables (future)
pages/         # Application pages
layouts/       # Page layouts
composables/   # Vue composables
utils/         # Utility functions
types/         # TypeScript type definitions
stores/        # Pinia stores
server/        # Nitro API routes
```
